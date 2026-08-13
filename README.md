# Blinx WhatsApp Bot — Setup Guide

A WhatsApp bot that answers FAQs about Blinx Lab semantically (via NVIDIA Nemotron), gives rough
quotations, offers to schedule a meeting (Calendly), or hands off to your team — all on
the free Meta Cloud API tier.

## What you'll have running at the end
- A phone number customers can WhatsApp with questions about Blinx.
- The bot answers naturally, in whatever language/tone they write in.
- It gives a rough price range when asked, always framed as an estimate.
- It offers a Calendly link when someone wants to talk further.
- It pings you (console log, or Slack if you set that up) whenever a real lead comes in.

---

## Part 1 — Get WhatsApp connected (Meta side, ~30–60 min + a few days for verification)

1. **Create a Meta Developer account**: go to https://developers.facebook.com, log in
   with a Facebook account (business one if you have it).
2. **Create an App** → choose type "Business" → give it a name like "Blinx Bot".
3. Inside the app dashboard, find **WhatsApp** in the left sidebar and click **Set up**.
4. This creates a **test phone number** automatically — good enough to build and test
   with immediately. You'll see:
   - A **Temporary access token** (valid 24h, fine for testing)
   - A **Phone number ID**
   - A **WhatsApp Business Account ID (WABA ID)**
   Copy these into your `.env` file (see Part 3).
5. Under **API Setup**, you can send yourself a test message straight from the dashboard
   to confirm the number works before writing any code.
6. **For a permanent token** (needed once you're live): go to **System Users** in
   Meta Business Suite settings → create a system user → generate a token with
   `whatsapp_business_messaging` + `whatsapp_business_management` permissions, set to
   never expire.
7. **To use your own business number instead of the test number**: in WhatsApp → API
   Setup → "Add phone number", verify it via SMS/call. Then submit your business for
   **Meta Business Verification** (needs your business documents/website) — this is
   the part that can take a few days. You can build and test everything on the free
   test number in the meantime.

## Part 2 — Deploy the server (Render, free)

1. Push this project folder to a GitHub repo (private is fine).
2. Go to https://render.com → New → Web Service → connect your repo.
3. Build command: `npm install` · Start command: `npm start`.
4. Add all the variables from `.env.example` under Render's **Environment** tab
   (with your real values — never commit your actual `.env` file to GitHub).
5. Deploy. Render gives you a URL like `https://blinx-bot.onrender.com`.

   Note: Render's free tier sleeps after inactivity, causing a ~30s delay on the first
   message after idle time. Fine for testing; if that's a problem once you're live,
   Render's cheapest paid tier (~$7/mo) removes it — still very low cost.

## Part 3 — Connect Meta to your server

1. In your `.env` (and matching Render env vars), set:
   - `WHATSAPP_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID` — from Part 1
   - `WHATSAPP_VERIFY_TOKEN` — make up any random string, e.g. `blinxbot_verify_8x2k`
   - `NVIDIA_API_KEY` — from https://build.nvidia.com (free tier available)
   - `CALENDLY_LINK` — create a free Calendly account, make an "Intro Call" event type,
     paste its link here
2. In the Meta App dashboard → WhatsApp → **Configuration** → Webhook:
   - Callback URL: `https://your-render-url.onrender.com/webhook`
   - Verify token: the exact same string you set as `WHATSAPP_VERIFY_TOKEN`
   - Click **Verify and Save**
3. Still in Configuration, under **Webhook fields**, subscribe to `messages`.
4. WhatsApp the test number from your own phone — you should get a bot reply within
   a couple of seconds.

## Part 4 — Make it actually yours

- **`data/knowledgeBase.js`** — edit the services, FAQs, and "how we work" copy to
  match exactly how you want the bot to describe Blinx.
- **`data/pricing.js`** — replace every placeholder number with your real ranges.
  This is the file that matters most before going live — right now it's all
  invented example data.
- **`lib/llm.js`** — the system prompt at the top controls the bot's personality
  and rules. Adjust tone/instructions here if you want it more formal/casual, or to
  ask different qualifying questions before quoting.

## Costs, realistically

- WhatsApp messaging: **free** (customer-initiated conversations are free and unlimited
  on Meta's Cloud API; you only pay if you send unsolicited template messages).
- Server: free on Render's free tier, or ~$7/mo if you want no sleep delay.
- NVIDIA Nemotron API: free tier available on build.nvidia.com — very low cost at
  moderate volume.
- Calendly: free plan is enough for one event type / one user.

## What's intentionally simple (upgrade path)

- **Leads** are logged to a local `leads.jsonl` file and printed to console. Once you're
  getting real volume, swap `logLead()` in `server.js` for a write to a Google Sheet
  (via a simple Apps Script webhook) or a proper CRM — the function signature won't need
  to change elsewhere.
- **Sessions** are in-memory (`lib/session.js`) — they reset if the server restarts.
  Fine for an MVP; move to a small database (Supabase has a free tier) when this matters.
- **Team notifications** default to console logging. Add a free Slack Incoming Webhook
  URL to `TEAM_NOTIFY_WEBHOOK_URL` in `.env` to get pinged in Slack instead — takes 5
  minutes to set up at https://api.slack.com/messaging/webhooks.
