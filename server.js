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
    const { replyText, actions } = await getBotResponse(session.history);
    appendMessage(from, "assistant", replyText);

    await sendText(from, replyText);

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
    await sendButtons(from, `Here's our booking link — pick a slot that works for you:\n${process.env.CALENDLY_LINK}`, [
      { id: "confirm_booked", title: "I've booked it" },
    ]).catch(() => sendText(from, `Book a slot here: ${process.env.CALENDLY_LINK}`));
    await logLead(from, "meeting_requested", action.input);
    await notifyTeam(`📅 Meeting requested by ${from}: ${action.input.context_summary}`);
  }

  if (action.name === "request_human_handoff") {
    await sendText(from, "No problem — I've flagged this for our team and someone will jump in shortly. You can also keep chatting with me in the meantime.");
    await logLead(from, "human_handoff", action.input);
    await notifyTeam(`🙋 Human handoff requested by ${from}: ${action.input.reason}`);
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

app.get("/", (_req, res) => res.send("Blinx WhatsApp bot is running."));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
