/**
 * Premium HTML Email Template for Blinx Lab
 * Designed to match https://blinxlab.in branding
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
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Strategy Session with Blinx Lab</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #0d0d0d;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #ffffff;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      table-layout: fixed;
      background-color: #0d0d0d;
      padding-bottom: 40px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #141414;
      border: 1px solid #262626;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 20px 40px rgba(0,0,0,0.6);
    }
    .header {
      padding: 36px 40px 24px;
      text-align: center;
      background: linear-gradient(180deg, #1f1f1f 0%, #141414 100%);
      border-bottom: 1px solid #262626;
    }
    .logo-text {
      font-size: 32px;
      font-weight: 900;
      letter-spacing: -1px;
      color: #ffffff;
      margin: 0;
      text-transform: lowercase;
    }
    .logo-x {
      color: #ff3366;
    }
    .logo-bar {
      color: #f5b041;
    }
    .tagline {
      font-size: 13px;
      color: #888888;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-top: 6px;
      font-weight: 600;
    }
    .content {
      padding: 36px 40px;
    }
    h1 {
      font-size: 24px;
      font-weight: 700;
      margin: 0 0 16px;
      color: #ffffff;
      line-height: 1.3;
    }
    p {
      font-size: 15px;
      line-height: 1.6;
      color: #cccccc;
      margin: 0 0 20px;
    }
    .highlight-card {
      background-color: #1c1c1c;
      border: 1px solid #2e2e2e;
      border-radius: 12px;
      padding: 24px;
      margin: 28px 0;
    }
    .detail-row {
      display: flex;
      margin-bottom: 12px;
      font-size: 14px;
    }
    .detail-label {
      color: #888888;
      width: 110px;
      font-weight: 600;
      text-transform: uppercase;
      font-size: 12px;
      letter-spacing: 0.5px;
    }
    .detail-val {
      color: #ffffff;
      font-weight: 600;
    }
    .btn-primary {
      display: block;
      width: 100%;
      box-sizing: border-box;
      background: linear-gradient(135deg, #ff3366 0%, #e6004c 100%);
      color: #ffffff !important;
      text-decoration: none;
      text-align: center;
      padding: 16px 24px;
      border-radius: 10px;
      font-size: 16px;
      font-weight: 700;
      letter-spacing: 0.3px;
      margin: 28px 0 16px;
      box-shadow: 0 8px 24px rgba(255, 51, 102, 0.35);
    }
    .btn-secondary {
      display: inline-block;
      padding: 10px 18px;
      background-color: #242424;
      border: 1px solid #383838;
      color: #cccccc !important;
      text-decoration: none;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      margin-right: 8px;
      margin-bottom: 8px;
    }
    .btn-danger {
      display: inline-block;
      padding: 10px 18px;
      background-color: #241417;
      border: 1px solid #4a1f26;
      color: #ff6685 !important;
      text-decoration: none;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      margin-bottom: 8px;
    }
    .agenda-box {
      margin: 28px 0;
      border-top: 1px solid #262626;
      padding-top: 24px;
    }
    .agenda-title {
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #f5b041;
      font-weight: 700;
      margin-bottom: 12px;
    }
    .agenda-item {
      display: flex;
      margin-bottom: 10px;
      font-size: 14px;
      color: #bbbbbb;
    }
    .agenda-bullet {
      color: #ff3366;
      margin-right: 10px;
      font-weight: bold;
    }
    .footer {
      padding: 24px 40px;
      background-color: #0f0f0f;
      border-top: 1px solid #222222;
      text-align: center;
      font-size: 12px;
      color: #666666;
    }
    .footer a {
      color: #888888;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td align="center" style="padding: 40px 15px 0;">
          <div class="container">
            
            <!-- Header -->
            <div class="header">
              <h2 class="logo-text">blin<span class="logo-x">x</span><span class="logo-bar">_</span></h2>
              <div class="tagline">High-Velocity Creative & Growth Agency</div>
            </div>

            <!-- Content -->
            <div class="content">
              <h1>Confirmed: Strategy Session 🚀</h1>
              <p>Hey <strong>${inviteeName}</strong>,</p>
              <p>Thanks for booking a session with <strong>Blinx Lab</strong>. We engineer high-performance creative, websites, and growth infrastructure built to break the algorithm.</p>

              <!-- Session Details Card -->
              <div class="highlight-card">
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="padding: 6px 0; color: #888888; font-size: 12px; font-weight: 600; text-transform: uppercase; width: 110px;">Session</td>
                    <td style="padding: 6px 0; color: #ffffff; font-size: 14px; font-weight: 700;">${meetingTitle}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #888888; font-size: 12px; font-weight: 600; text-transform: uppercase;">Date & Time</td>
                    <td style="padding: 6px 0; color: #f5b041; font-size: 14px; font-weight: 700;">${dateTime}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #888888; font-size: 12px; font-weight: 600; text-transform: uppercase;">Location</td>
                    <td style="padding: 6px 0; color: #ffffff; font-size: 14px; font-weight: 700;">Google Meet (Video Call)</td>
                  </tr>
                </table>
              </div>

              <!-- Main CTA: Join Call Button -->
              <a href="${meetLink}" target="_blank" class="btn-primary">
                🎥 Join Google Meet Session
              </a>

              <!-- Agenda -->
              <div class="agenda-box">
                <div class="agenda-title">✦ What We'll Cover on This Call</div>
                <div class="agenda-item"><span class="agenda-bullet">01.</span> Current bottleneck breakdown (website, branding, paid ads, or SMM)</div>
                <div class="agenda-item"><span class="agenda-bullet">02.</span> Creative & high-velocity growth roadmap</div>
                <div class="agenda-item"><span class="agenda-bullet">03.</span> Tailored project scope, timeline & direct quote</div>
              </div>

              <!-- Manage Meeting Buttons -->
              <div style="margin-top: 28px; border-top: 1px solid #262626; padding-top: 20px;">
                <p style="font-size: 13px; color: #888888; margin-bottom: 12px;">Need to make changes to your time?</p>
                <div>
                  <a href="${rescheduleLink}" target="_blank" class="btn-secondary">🔄 Reschedule Time</a>
                  <a href="${cancelLink}" target="_blank" class="btn-danger">✕ Cancel Session</a>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div class="footer">
              <p style="margin: 0 0 8px; color: #888888; font-size: 13px;">
                <strong>Blinx Lab</strong> • <a href="https://blinxlab.in/" target="_blank">blinxlab.in</a>
              </p>
              <p style="margin: 0; color: #555555; font-size: 11px;">
                Contact: blinxlab.official@gmail.com | Mathura / India
              </p>
            </div>

          </div>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>`;
}

module.exports = { generateBookingEmail };
