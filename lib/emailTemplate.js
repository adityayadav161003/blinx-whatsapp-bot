/**
 * Premium Dark-Mode Email Template for Blinx Lab
 * Includes anti-inversion technology to guarantee consistent dark aesthetic
 * across Apple Mail, Gmail (iOS/Android), and Outlook.
 */

function generateBookingEmail({
  inviteeName = "there",
  meetingTitle = "30-Minute Strategy Session",
  dateTime = "Scheduled Date & Time",
  meetLink = "https://meet.google.com",
  rescheduleLink = "https://calendly.com/blinxlab-official/30min",
  cancelLink = "https://calendly.com/blinxlab-official/30min",
}) {
  return `<!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>Confirmed: Strategy Session with Blinx Lab</title>
  <style>
    :root {
      color-scheme: light dark;
      supported-color-schemes: light dark;
    }
    body {
      margin: 0 !important;
      padding: 0 !important;
      background: #0a0a0a !important;
      background-color: #0a0a0a !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #ffffff !important;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100% !important;
      background: linear-gradient(#0a0a0a, #0a0a0a) !important;
      background-color: #0a0a0a !important;
      padding: 20px 0 40px;
    }
    .container {
      width: 92%;
      max-width: 560px;
      margin: 0 auto;
      background: linear-gradient(#141414, #141414) !important;
      background-color: #141414 !important;
      border: 1px solid #262626 !important;
      border-radius: 16px;
      overflow: hidden;
    }
    .header {
      padding: 32px 24px 20px;
      text-align: center;
      background: linear-gradient(180deg, #1e1e1e 0%, #141414 100%) !important;
      border-bottom: 1px solid #222222 !important;
    }
    .logo-text {
      font-size: 30px;
      font-weight: 900;
      letter-spacing: -0.5px;
      color: #ffffff !important;
      margin: 0;
      text-transform: lowercase;
    }
    .logo-x { color: #ff3366 !important; }
    .logo-bar { color: #f5b041 !important; }
    .tagline {
      font-size: 11px;
      color: #888888 !important;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-top: 6px;
      font-weight: 700;
    }
    .content {
      padding: 28px 24px 32px;
      background: linear-gradient(#141414, #141414) !important;
      background-color: #141414 !important;
    }
    h1 {
      font-size: 22px;
      font-weight: 700;
      margin: 0 0 14px;
      color: #ffffff !important;
      line-height: 1.3;
    }
    p {
      font-size: 15px;
      line-height: 1.6;
      color: #cccccc !important;
      margin: 0 0 18px;
    }
    .card {
      background: linear-gradient(#1b1b1b, #1b1b1b) !important;
      background-color: #1b1b1b !important;
      border: 1px solid #2b2b2b !important;
      border-radius: 12px;
      padding: 20px;
      margin: 24px 0;
    }
    .card-item {
      margin-bottom: 14px;
    }
    .card-item:last-child {
      margin-bottom: 0;
    }
    .card-label {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #888888 !important;
      margin-bottom: 4px;
    }
    .card-value {
      font-size: 15px;
      font-weight: 700;
      color: #ffffff !important;
      line-height: 1.4;
    }
    .card-value-gold {
      font-size: 16px;
      font-weight: 700;
      color: #f5b041 !important;
      line-height: 1.4;
    }
    .btn-main {
      display: block;
      width: 100%;
      box-sizing: border-box;
      background: linear-gradient(135deg, #ff3366 0%, #d60045 100%) !important;
      color: #ffffff !important;
      text-decoration: none;
      text-align: center;
      padding: 16px 20px;
      border-radius: 10px;
      font-size: 16px;
      font-weight: 700;
      letter-spacing: 0.3px;
      margin: 24px 0 16px;
    }
    .agenda-wrap {
      margin: 24px 0 20px;
      border-top: 1px solid #222222 !important;
      padding-top: 20px;
    }
    .agenda-heading {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: #f5b041 !important;
      font-weight: 700;
      margin-bottom: 12px;
    }
    .agenda-row {
      margin-bottom: 10px;
      font-size: 14px;
      line-height: 1.5;
      color: #bbbbbb !important;
    }
    .agenda-num {
      color: #ff3366 !important;
      font-weight: 700;
      margin-right: 6px;
    }
    .btn-action {
      display: inline-block;
      padding: 10px 16px;
      background: linear-gradient(#222222, #222222) !important;
      background-color: #222222 !important;
      border: 1px solid #333333 !important;
      color: #cccccc !important;
      text-decoration: none;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      margin-right: 8px;
      margin-bottom: 8px;
    }
    .btn-action-cancel {
      display: inline-block;
      padding: 10px 16px;
      background: linear-gradient(#221517, #221517) !important;
      background-color: #221517 !important;
      border: 1px solid #441c22 !important;
      color: #ff6685 !important;
      text-decoration: none;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      margin-bottom: 8px;
    }
    .footer {
      padding: 20px 24px;
      background: linear-gradient(#0d0d0d, #0d0d0d) !important;
      background-color: #0d0d0d !important;
      border-top: 1px solid #1e1e1e !important;
      text-align: center;
      font-size: 12px;
      color: #666666 !important;
    }
    .footer a {
      color: #888888 !important;
      text-decoration: none;
    }

    /* Target Dark Mode Explicitly */
    @media (prefers-color-scheme: dark) {
      body, .wrapper { background: #0a0a0a !important; background-color: #0a0a0a !important; }
      .container, .content { background: #141414 !important; background-color: #141414 !important; }
      .card { background: #1b1b1b !important; background-color: #1b1b1b !important; }
      h1, .card-value, .logo-text { color: #ffffff !important; }
      p { color: #cccccc !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#0a0a0a;color:#ffffff;">
  <div class="wrapper" style="background-color:#0a0a0a;width:100%;padding:20px 0 40px;">
    <div class="container" style="max-width:560px;margin:0 auto;background-color:#141414;border:1px solid #262626;border-radius:16px;overflow:hidden;">
      
      <!-- Header -->
      <div class="header" style="padding:32px 24px 20px;text-align:center;background-color:#1a1a1a;border-bottom:1px solid #222222;">
        <h2 class="logo-text" style="font-size:30px;font-weight:900;color:#ffffff;margin:0;letter-spacing:-0.5px;">blin<span class="logo-x" style="color:#ff3366;">x</span><span class="logo-bar" style="color:#f5b041;">_</span></h2>
        <div class="tagline" style="font-size:11px;color:#888888;text-transform:uppercase;letter-spacing:2px;margin-top:6px;font-weight:700;">High-Velocity Creative & Growth Agency</div>
      </div>

      <!-- Content -->
      <div class="content" style="padding:28px 24px 32px;background-color:#141414;">
        <h1 style="font-size:22px;font-weight:700;margin:0 0 14px;color:#ffffff;line-height:1.3;">Confirmed: Strategy Session</h1>
        <p style="font-size:15px;line-height:1.6;color:#cccccc;margin:0 0 18px;">Hey <strong>${inviteeName}</strong>,</p>
        <p style="font-size:15px;line-height:1.6;color:#cccccc;margin:0 0 18px;">Thanks for booking a session with <strong>Blinx Lab</strong>. We engineer high-performance creative, websites, and growth infrastructure built to break the algorithm.</p>

        <!-- Session Details: Stacked Card Layout -->
        <div class="card" style="background-color:#1b1b1b;border:1px solid #2b2b2b;border-radius:12px;padding:20px;margin:24px 0;">
          <div class="card-item" style="margin-bottom:14px;">
            <div class="card-label" style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#888888;margin-bottom:4px;">Session</div>
            <div class="card-value" style="font-size:15px;font-weight:700;color:#ffffff;line-height:1.4;">${meetingTitle}</div>
          </div>
          <div class="card-item" style="margin-bottom:14px;">
            <div class="card-label" style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#888888;margin-bottom:4px;">Date & Time</div>
            <div class="card-value-gold" style="font-size:16px;font-weight:700;color:#f5b041;line-height:1.4;">${dateTime}</div>
          </div>
          <div class="card-item" style="margin-bottom:0;">
            <div class="card-label" style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#888888;margin-bottom:4px;">Location</div>
            <div class="card-value" style="font-size:15px;font-weight:700;color:#ffffff;line-height:1.4;">Google Meet (Video Call)</div>
          </div>
        </div>

        <!-- Primary Action Button -->
        <a href="${meetLink}" target="_blank" class="btn-main" style="display:block;background-color:#ff3366;color:#ffffff!important;text-decoration:none;text-align:center;padding:16px 20px;border-radius:10px;font-size:16px;font-weight:700;margin:24px 0 16px;">
          Join Google Meet Session
        </a>

        <!-- Agenda Section -->
        <div class="agenda-wrap" style="margin:24px 0 20px;border-top:1px solid #222222;padding-top:20px;">
          <div class="agenda-heading" style="font-size:12px;text-transform:uppercase;letter-spacing:1.5px;color:#f5b041;font-weight:700;margin-bottom:12px;">&#10022; What We'll Cover on This Call</div>
          <div class="agenda-row" style="margin-bottom:10px;font-size:14px;line-height:1.5;color:#bbbbbb;"><span class="agenda-num" style="color:#ff3366;font-weight:700;margin-right:6px;">01.</span> Current bottleneck breakdown (website, branding, paid ads, or SMM)</div>
          <div class="agenda-row" style="margin-bottom:10px;font-size:14px;line-height:1.5;color:#bbbbbb;"><span class="agenda-num" style="color:#ff3366;font-weight:700;margin-right:6px;">02.</span> Creative & high-velocity growth roadmap</div>
          <div class="agenda-row" style="margin-bottom:10px;font-size:14px;line-height:1.5;color:#bbbbbb;"><span class="agenda-num" style="color:#ff3366;font-weight:700;margin-right:6px;">03.</span> Tailored project scope, timeline & direct quote</div>
        </div>

        <!-- Manage Call Links -->
        <div style="margin-top:24px;border-top:1px solid #222222;padding-top:18px;">
          <p style="font-size:13px;color:#888888;margin-bottom:12px;">Need to make changes to your time?</p>
          <div>
            <a href="${rescheduleLink}" target="_blank" class="btn-action" style="display:inline-block;padding:10px 16px;background-color:#222222;border:1px solid #333333;color:#cccccc!important;text-decoration:none;border-radius:8px;font-size:13px;font-weight:600;margin-right:8px;margin-bottom:8px;">Reschedule Time</a>
            <a href="${cancelLink}" target="_blank" class="btn-action-cancel" style="display:inline-block;padding:10px 16px;background-color:#221517;border:1px solid #441c22;color:#ff6685!important;text-decoration:none;border-radius:8px;font-size:13px;font-weight:600;margin-bottom:8px;">Cancel Session</a>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="footer" style="padding:20px 24px;background-color:#0d0d0d;border-top:1px solid #1e1e1e;text-align:center;font-size:12px;color:#666666;">
        <p style="margin:0 0 6px;color:#888888;font-size:13px;">
          <strong>Blinx Lab</strong> • <a href="https://blinxlab.in/" target="_blank" style="color:#888888;text-decoration:none;">blinxlab.in</a>
        </p>
        <p style="margin:0;color:#555555;font-size:11px;">
          Contact: blinxlab.official@gmail.com | Mathura / India
        </p>
      </div>

    </div>
  </div>
</body>
</html>`;
}

module.exports = { generateBookingEmail };
