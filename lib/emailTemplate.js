/**
 * Premium Mobile-Optimized HTML Email Template for Blinx Lab
 * Designed to match https://blinxlab.in branding with fluid mobile responsiveness
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
  <title>Confirmed: Strategy Session with Blinx Lab</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #0a0a0a;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #ffffff;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100% !important;
      background-color: #0a0a0a;
      padding: 20px 0 40px;
    }
    .container {
      width: 92%;
      max-width: 560px;
      margin: 0 auto;
      background-color: #141414;
      border: 1px solid #262626;
      border-radius: 16px;
      overflow: hidden;
    }
    .header {
      padding: 32px 24px 20px;
      text-align: center;
      background: linear-gradient(180deg, #1e1e1e 0%, #141414 100%);
      border-bottom: 1px solid #222222;
    }
    .logo-text {
      font-size: 30px;
      font-weight: 900;
      letter-spacing: -0.5px;
      color: #ffffff;
      margin: 0;
      text-transform: lowercase;
    }
    .logo-x { color: #ff3366; }
    .logo-bar { color: #f5b041; }
    .tagline {
      font-size: 11px;
      color: #888888;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-top: 6px;
      font-weight: 700;
    }
    .content {
      padding: 28px 24px 32px;
    }
    h1 {
      font-size: 22px;
      font-weight: 700;
      margin: 0 0 14px;
      color: #ffffff;
      line-height: 1.3;
    }
    p {
      font-size: 15px;
      line-height: 1.6;
      color: #cccccc;
      margin: 0 0 18px;
    }
    .card {
      background-color: #1b1b1b;
      border: 1px solid #2b2b2b;
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
      color: #888888;
      margin-bottom: 4px;
    }
    .card-value {
      font-size: 15px;
      font-weight: 700;
      color: #ffffff;
      line-height: 1.4;
    }
    .card-value-gold {
      font-size: 16px;
      font-weight: 700;
      color: #f5b041;
      line-height: 1.4;
    }
    .btn-main {
      display: block;
      width: 100%;
      box-sizing: border-box;
      background: linear-gradient(135deg, #ff3366 0%, #d60045 100%);
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
      border-top: 1px solid #222222;
      padding-top: 20px;
    }
    .agenda-heading {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: #f5b041;
      font-weight: 700;
      margin-bottom: 12px;
    }
    .agenda-row {
      margin-bottom: 10px;
      font-size: 14px;
      line-height: 1.5;
      color: #bbbbbb;
    }
    .agenda-num {
      color: #ff3366;
      font-weight: 700;
      margin-right: 6px;
    }
    .btn-action {
      display: inline-block;
      padding: 10px 16px;
      background-color: #222222;
      border: 1px solid #333333;
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
      background-color: #221517;
      border: 1px solid #441c22;
      color: #ff6685 !important;
      text-decoration: none;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      margin-bottom: 8px;
    }
    .footer {
      padding: 20px 24px;
      background-color: #0d0d0d;
      border-top: 1px solid #1e1e1e;
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
    <div class="container">
      
      <!-- Header -->
      <div class="header">
        <h2 class="logo-text">blin<span class="logo-x">x</span><span class="logo-bar">_</span></h2>
        <div class="tagline">High-Velocity Creative & Growth Agency</div>
      </div>

      <!-- Content -->
      <div class="content">
        <h1>Confirmed: Strategy Session</h1>
        <p>Hey <strong>${inviteeName}</strong>,</p>
        <p>Thanks for booking a session with <strong>Blinx Lab</strong>. We engineer high-performance creative, websites, and growth infrastructure built to break the algorithm.</p>

        <!-- Session Details: Stacked Card Layout for Spacious Readability -->
        <div class="card">
          <div class="card-item">
            <div class="card-label">Session</div>
            <div class="card-value">${meetingTitle}</div>
          </div>
          <div class="card-item">
            <div class="card-label">Date & Time</div>
            <div class="card-value-gold">${dateTime}</div>
          </div>
          <div class="card-item">
            <div class="card-label">Location</div>
            <div class="card-value">Google Meet (Video Call)</div>
          </div>
        </div>

        <!-- Primary Action Button -->
        <a href="${meetLink}" target="_blank" class="btn-main">
          Join Google Meet Session
        </a>

        <!-- Agenda Section -->
        <div class="agenda-wrap">
          <div class="agenda-heading">&#10022; What We'll Cover on This Call</div>
          <div class="agenda-row"><span class="agenda-num">01.</span> Current bottleneck breakdown (website, branding, paid ads, or SMM)</div>
          <div class="agenda-row"><span class="agenda-num">02.</span> Creative & high-velocity growth roadmap</div>
          <div class="agenda-row"><span class="agenda-num">03.</span> Tailored project scope, timeline & direct quote</div>
        </div>

        <!-- Manage Call Links -->
        <div style="margin-top: 24px; border-top: 1px solid #222222; padding-top: 18px;">
          <p style="font-size: 13px; color: #888888; margin-bottom: 12px;">Need to make changes to your time?</p>
          <div>
            <a href="${rescheduleLink}" target="_blank" class="btn-action">Reschedule Time</a>
            <a href="${cancelLink}" target="_blank" class="btn-action-cancel">Cancel Session</a>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="footer">
        <p style="margin: 0 0 6px; color: #888888; font-size: 13px;">
          <strong>Blinx Lab</strong> • <a href="https://blinxlab.in/" target="_blank">blinxlab.in</a>
        </p>
        <p style="margin: 0; color: #555555; font-size: 11px;">
          Contact: blinxlab.official@gmail.com | Mathura / India
        </p>
      </div>

    </div>
  </div>
</body>
</html>`;
}

module.exports = { generateBookingEmail };
