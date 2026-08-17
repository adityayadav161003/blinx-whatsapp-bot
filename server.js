require("dotenv").config();
const express = require("express");
const fs = require("fs");
const path = require("path");
const axios = require("axios");

const { getBotResponse } = require("./lib/llm");
const { sendText, sendButtons, markAsRead } = require("./lib/whatsapp");
const { getSession, appendMessage } = require("./lib/session");

const app = express();
app.use(express.json());

const LEADS_FILE = path.join(__dirname, "leads.jsonl");
const ENGAGED_USERS_FILE = path.join(__dirname, "engaged_users.csv");

// Ensure the engaged users CSV has a header row
if (!fs.existsSync(ENGAGED_USERS_FILE)) {
  fs.writeFileSync(ENGAGED_USERS_FILE, "phone_number\n");
}

// Track which users have already been logged (to avoid duplicates)
const loggedEngagedUsers = new Set();
// Pre-load already-logged numbers from the CSV on startup
try {
  const existing = fs.readFileSync(ENGAGED_USERS_FILE, "utf-8");
  for (const line of existing.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && trimmed !== "phone_number") loggedEngagedUsers.add(trimmed);
  }
} catch {}

// ---------- 1. Webhook verification (Meta calls this once when you connect it) ----------
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    console.log("Webhook verified.");
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
});

// ---------- 2. Incoming messages ----------
app.post("/webhook", async (req, res) => {
  // Always ack fast so Meta doesn't retry/duplicate
  res.sendStatus(200);

  try {
    const entry = req.body.entry?.[0];
    const change = entry?.changes?.[0];
    const message = change?.value?.messages?.[0];
    if (!message) return; // could be a status update (delivered/read), ignore

    const from = message.from; // user's WhatsApp number
    const userText =
      message.type === "text"
        ? message.text.body
        : message.type === "interactive"
        ? message.interactive?.button_reply?.title || "(selected an option)"
        : "(sent a non-text message)";

    await markAsRead(message.id).catch(() => {});

    const session = appendMessage(from, "user", userText);

    // --- Engagement tracking: log phone number after 3 user messages ---
    const userMsgCount = session.history.filter(m => m.role === "user").length;
    if (userMsgCount >= 3 && !loggedEngagedUsers.has(from)) {
      loggedEngagedUsers.add(from);
      fs.appendFileSync(ENGAGED_USERS_FILE, from + "\n");
      console.log(`[ENGAGED] Logged phone number: ${from}`);
    }

    // --- Instant verification when user confirms booking on WhatsApp ---
    if (message.interactive?.button_reply?.id === "confirm_booked" || userText.trim().toLowerCase() === "i've booked it") {
      const confirmText = "Awesome! 🎉 Your meeting is confirmed on our calendar. Our team is excited to connect with you! Feel free to ask any other questions here in the meantime.";
      appendMessage(from, "user", userText);
      appendMessage(from, "assistant", confirmText);
      await sendText(from, confirmText);
      await logLead(from, "booking_confirmed_by_user", { status: "confirmed" });
      await notifyTeam(`🎉 Booking confirmed by client ${from} on WhatsApp!`);
      return;
    }

    let { replyText, actions } = await getBotResponse(session.history);

    // --- Deterministic Scheduling Guarantee ---
    const lowerUserText = userText.trim().toLowerCase();
    const scheduleKeywords = [
      "schedule meeting", "schedule a meeting", "schedule call", "schedule a call",
      "book meeting", "book a meeting", "book call", "book a call", "book a slot",
      "calendly", "want a meeting", "want to meet", "set up a call", "setup a call",
      "let's meet", "lets meet", "schedule meet"
    ];
    const userWantsMeeting = scheduleKeywords.some(kw => lowerUserText.includes(kw));
    const aiMentionsInvite = replyText && (
      replyText.toLowerCase().includes("send over a meeting invite") ||
      replyText.toLowerCase().includes("schedule a meeting for you") ||
      replyText.toLowerCase().includes("schedule a call for you") ||
      replyText.toLowerCase().includes("set up a call for you") ||
      replyText.toLowerCase().includes("arrange that call")
    );

    if ((userWantsMeeting || aiMentionsInvite) && !actions.some(a => a.name === "schedule_meeting")) {
      actions.push({
        name: "schedule_meeting",
        input: { context_summary: userText },
      });
      if (aiMentionsInvite) {
        replyText = "";
      }
    }

    // --- Deterministic Call Request Guarantee ---
    const callKeywords = ["request a call", "request call", "call me", "give me a call", "can you call me", "please call me"];
    const userWantsCall = callKeywords.some(kw => lowerUserText.includes(kw));
    if (userWantsCall && !actions.some(a => a.name === "request_call")) {
      actions.push({
        name: "request_call",
        input: { reason: userText },
      });
      replyText = "";
    }

    if (replyText && replyText.trim()) {
      appendMessage(from, "assistant", replyText);
      await sendText(from, replyText);
    }

    for (const action of actions) {
      await handleAction(from, action);
    }
  } catch (err) {
    console.error("Error handling webhook:", err?.response?.data || err.message);
  }
});

// ---------- 3. Action handlers ----------
async function handleAction(from, action) {
  if (action.name === "schedule_meeting") {
    const baseCalendlyUrl = process.env.CALENDLY_LINK || "https://calendly.com/blinxlab-official/30min";
    const separator = baseCalendlyUrl.includes("?") ? "&" : "?";
    const calendlyUrl = `${baseCalendlyUrl}${separator}utm_term=${from}`;
    await sendButtons(from, `Here's our booking link — pick a slot that works for you:\n${calendlyUrl}`, [
      { id: "confirm_booked", title: "I've booked it" },
    ]).catch(() => sendText(from, `Book a slot here: ${calendlyUrl}`));
    await logLead(from, "meeting_requested", action.input);
    await notifyTeam(`📅 Meeting requested by ${from}: ${action.input.context_summary}`);
  }

  if (action.name === "request_human_handoff") {
    await sendText(from, "No problem — I've flagged this for our team and someone will jump in shortly. You can also keep chatting with me in the meantime.");
    await logLead(from, "human_handoff", action.input);
    await notifyTeam(`🙋 Human handoff requested by ${from}: ${action.input.reason}`);
  }

  if (action.name === "request_call") {
    await sendText(from, "Absolutely! Our team has been notified and we will get back to you as soon as we can. Thank you for reaching out to Blinx! 🙏");
    await logLead(from, "call_requested", action.input);
    await notifyTeam(`📞 URGENT — Call requested by ${from}: ${action.input.reason}`);
  }

  if (action.name === "capture_lead") {
    await logLead(from, "lead_captured", action.input);
    await notifyTeam(`✨ New lead from ${from}: ${action.input.need_summary}`);
  }
}

// ---------- 4. Lead logging (swap for a real DB/CRM later) ----------
async function logLead(from, type, data) {
  const entry = { from, type, data, timestamp: new Date().toISOString() };
  fs.appendFileSync(LEADS_FILE, JSON.stringify(entry) + "\n");
}

async function notifyTeam(text) {
  if (!process.env.TEAM_NOTIFY_WEBHOOK_URL) {
    console.log("[TEAM NOTIFY]", text);
    return;
  }
  try {
    await axios.post(process.env.TEAM_NOTIFY_WEBHOOK_URL, { text });
  } catch (err) {
    console.error("Failed to notify team:", err.message);
  }
}

// ---------- 5. Calendly Webhook (Automatic WhatsApp confirmation) ----------
app.post("/calendly-webhook", async (req, res) => {
  res.sendStatus(200);

  try {
    const payload = req.body?.payload;
    if (!payload) return;

    const inviteeName = payload.name || "there";
    const inviteeEmail = payload.email;

    // 1. Check utm_term tracking for user's WhatsApp number
    let phoneNumber = payload.tracking?.utm_term;

    // 2. Check questions_and_answers for phone number
    if (!phoneNumber && payload.questions_and_answers) {
      for (const qa of payload.questions_and_answers) {
        const cleaned = (qa.answer || "").replace(/\D/g, "");
        if (cleaned.length >= 10) {
          phoneNumber = cleaned.length === 10 ? `91${cleaned}` : cleaned;
          break;
        }
      }
    }

    if (phoneNumber) {
      const confirmText = `Awesome ${inviteeName}! 🎉 Your 30-minute strategy call with Blinx Lab is officially confirmed on our calendar. Our team is excited to connect with you! Feel free to ask any other questions here in the meantime.`;
      await sendText(phoneNumber, confirmText);
      await logLead(phoneNumber, "calendly_auto_confirmed", { name: inviteeName, email: inviteeEmail });
      await notifyTeam(`🎉 Auto-confirmed Calendly booking on WhatsApp for ${inviteeName} (+${phoneNumber})!`);
    } else {
      await notifyTeam(`📅 New Calendly booking received for ${inviteeName} (${inviteeEmail})!`);
    }
  } catch (err) {
    console.error("Error processing Calendly webhook:", err.message);
  }
});

app.get("/", (_req, res) => res.send("Blinx WhatsApp bot is running."));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
