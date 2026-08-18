require("dotenv").config();
const express = require("express");
const fs = require("fs");
const path = require("path");
const axios = require("axios");

const { getBotResponse } = require("./lib/llm");
const { sendText, sendButtons, markAsRead } = require("./lib/whatsapp");
const { getSession, appendMessage } = require("./lib/session");
const { sendBookingConfirmationEmail } = require("./lib/mailer");
const { generateBookingEmail } = require("./lib/emailTemplate");

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
    console.log(`[CALENDLY WEBHOOK] Received event: ${req.body?.event}`);
    const payload = req.body?.payload;
    if (!payload) {
      console.log("[CALENDLY WEBHOOK] Empty payload received");
      return;
    }

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

    // Client chooses slot on Calendly -> Calendly & Google Calendar send the official invitation.
    // We log the lead into CRM and send the instant WhatsApp confirmation to ensure exactly 1 email is delivered!
    console.log(`[CALENDLY WEBHOOK] Booking confirmed for ${inviteeName} (${inviteeEmail})`);

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

// Live preview of the custom HTML email template
app.get("/preview-email", (_req, res) => {
  const html = generateBookingEmail({
    inviteeName: "Aditya",
    meetingTitle: "30-Minute Strategy Session",
    dateTime: "Thursday, August 20, 2026 at 11:30 AM IST",
    meetLink: "https://meet.google.com/blinx-lab-strategy",
    rescheduleLink: "https://calendly.com/blinxlab-official/30min",
    cancelLink: "https://calendly.com/blinxlab-official/30min",
  });
  res.setHeader("Content-Type", "text/html");
  res.send(html);
});

// Diagnostic route to test sending custom HTML email directly
app.get("/test-email", async (req, res) => {
  const to = req.query.to || "adity6946@gmail.com";
  const result = await sendBookingConfirmationEmail({
    toEmail: to,
    inviteeName: "Aditya",
    meetingTitle: "30-Minute Strategy Session",
    dateTime: "Thursday, August 20, 2026 at 11:30 AM IST",
    meetLink: "https://meet.google.com/axv-kwyn-cyk",
    rescheduleLink: "https://calendly.com/blinxlab-official/30min",
    cancelLink: "https://calendly.com/blinxlab-official/30min",
  });
  res.json({
    status: result.success ? "success" : "failed",
    details: result,
    toEmail: to,
    hasResend: Boolean(
      process.env.RESEND_API_KEY ||
      process.env.RESEND_KEY ||
      process.env.resend_api_key ||
      process.env.RESEND
    ),
    gmailUser: process.env.GMAIL_USER || "blinxlab.official@gmail.com",
    hasPassword: Boolean(process.env.GMAIL_APP_PASSWORD),
  });
});

// Helper to aggregate all leads and statuses into a clean CRM list
function getCRMData() {
  const crmMap = new Map();

  // 1. Add engaged users (chat activity)
  if (fs.existsSync(ENGAGED_USERS_FILE)) {
    try {
      const lines = fs.readFileSync(ENGAGED_USERS_FILE, "utf-8").split("\n");
      for (const line of lines) {
        const phone = line.trim();
        if (phone && phone !== "phone_number") {
          crmMap.set(phone, {
            phone,
            name: "Prospect",
            email: "—",
            status: "💬 High Engagement (3+ Messages)",
            details: "Active conversation on WhatsApp",
            timestamp: "Recently",
          });
        }
      }
    } catch {}
  }

  // 2. Add structured leads from leads.jsonl
  if (fs.existsSync(LEADS_FILE)) {
    try {
      const lines = fs.readFileSync(LEADS_FILE, "utf-8").split("\n");
      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const entry = JSON.parse(line.trim());
          const phone = entry.from;
          const existing = crmMap.get(phone) || { phone, name: "Prospect", email: "—", details: "—" };

          if (entry.type === "calendly_auto_confirmed") {
            existing.status = "🎉 CONFIRMED (Booked on Calendly)";
            existing.name = entry.data?.name || existing.name;
            existing.email = entry.data?.email || existing.email;
            existing.details = "Meeting confirmed on calendar";
          } else if (entry.type === "meeting_requested") {
            if (!existing.status || !existing.status.includes("CONFIRMED")) {
              existing.status = "⏳ Meeting Link Sent (Pending Booking)";
              existing.details = entry.data?.context_summary || existing.details;
            }
          } else if (entry.type === "call_requested") {
            existing.status = "📞 Phone Call Requested";
            existing.details = entry.data?.reason || existing.details;
          } else if (entry.type === "lead_captured") {
            existing.details = entry.data?.need_summary || existing.details;
          }

          existing.timestamp = entry.timestamp ? new Date(entry.timestamp).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) : existing.timestamp;
          crmMap.set(phone, existing);
        } catch {}
      }
    } catch {}
  }

  return Array.from(crmMap.values());
}

// Live CRM Dashboard
app.get("/crm", (_req, res) => {
  const leads = getCRMData();
  const confirmedCount = leads.filter(l => l.status.includes("CONFIRMED")).length;
  const pendingCount = leads.filter(l => l.status.includes("Pending") || l.status.includes("High Engagement")).length;
  const callCount = leads.filter(l => l.status.includes("Call")).length;

  const rows = leads.map((l, i) => `
    <tr style="border-bottom: 1px solid #222;">
      <td style="padding: 14px 16px; color: #888;">${i + 1}</td>
      <td style="padding: 14px 16px; font-weight: 700; color: #fff;">
        +${l.phone}
        <a href="https://wa.me/${l.phone}" target="_blank" style="margin-left: 8px; font-size: 12px; background: #25D366; color: #000; padding: 3px 8px; border-radius: 4px; text-decoration: none; font-weight: 700;">Chat on WhatsApp ↗</a>
      </td>
      <td style="padding: 14px 16px; color: #fff;">${l.name}</td>
      <td style="padding: 14px 16px; color: #888;">${l.email}</td>
      <td style="padding: 14px 16px;">
        <span style="display: inline-block; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 700; ${
          l.status.includes("CONFIRMED") ? "background: #123820; color: #4ade80;" :
          l.status.includes("Call") ? "background: #3b2210; color: #fb923c;" :
          "background: #1e293b; color: #38bdf8;"
        }">${l.status}</span>
      </td>
      <td style="padding: 14px 16px; color: #aaa; font-size: 13px;">${l.details}</td>
      <td style="padding: 14px 16px; color: #666; font-size: 12px;">${l.timestamp}</td>
    </tr>
  `).join("");

  const html = `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Blinx Lab • Client CRM & Lead Pipeline</title>
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0a0a0a; color: #fff; margin: 0; padding: 24px; }
      .container { max-width: 1200px; margin: 0 auto; }
      .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #222; }
      .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px; }
      .stat-card { background: #141414; border: 1px solid #262626; border-radius: 12px; padding: 18px; }
      .stat-val { font-size: 28px; font-weight: 900; color: #fff; margin-top: 4px; }
      .stat-label { font-size: 12px; text-transform: uppercase; color: #888; letter-spacing: 1px; font-weight: 700; }
      .btn-download { background: linear-gradient(135deg, #ff3366, #d60045); color: #fff; padding: 10px 18px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 14px; }
      table { width: 100%; border-collapse: collapse; background: #141414; border-radius: 12px; overflow: hidden; border: 1px solid #262626; }
      th { text-align: left; padding: 14px 16px; background: #1c1c1c; color: #888; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <div>
          <h1 style="margin: 0; font-size: 26px;">blin<span style="color:#ff3366;">x</span><span style="color:#f5b041;">_</span> Client Pipeline</h1>
          <p style="margin: 4px 0 0; color: #888; font-size: 14px;">Live WhatsApp Inquiries &amp; Booking Conversion Tracking</p>
        </div>
        <a href="/leads.csv" class="btn-download">⬇ Export CSV (Excel / Sheets)</a>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-label">Total Prospects</div>
          <div class="stat-val">${leads.length}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Confirmed Bookings</div>
          <div class="stat-val" style="color: #4ade80;">${confirmedCount}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Pending Conversions</div>
          <div class="stat-val" style="color: #38bdf8;">${pendingCount}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Call Requests</div>
          <div class="stat-val" style="color: #fb923c;">${callCount}</div>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Phone &amp; Direct Chat</th>
            <th>Client Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Interest / Details</th>
            <th>Last Active</th>
          </tr>
        </thead>
        <tbody>
          ${rows.length > 0 ? rows : '<tr><td colspan="7" style="padding: 30px; text-align: center; color: #666;">No leads captured yet. Send a test message on WhatsApp!</td></tr>'}
        </tbody>
      </table>
    </div>
  </body>
  </html>`;

  res.setHeader("Content-Type", "text/html");
  res.send(html);
});

// CSV Export Endpoint
app.get("/leads.csv", (_req, res) => {
  const leads = getCRMData();
  let csv = "phone_number,name,email,status,interest_details,last_active\n";
  for (const l of leads) {
    csv += `"${l.phone}","${l.name}","${l.email}","${l.status}","${l.details.replace(/"/g, '""')}","${l.timestamp}"\n`;
  }
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", 'attachment; filename="blinx_leads_crm.csv"');
  res.send(csv);
});

app.get("/leads", (_req, res) => res.redirect("/crm"));
app.get("/engaged-users", (_req, res) => res.redirect("/crm"));
app.get("/engaged_users.csv", (_req, res) => res.redirect("/leads.csv"));

app.get("/", (_req, res) => res.send("Blinx WhatsApp bot is running."));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
