const nodemailer = require("nodemailer");
const axios = require("axios");
const dns = require("dns");
const { generateBookingEmail } = require("./emailTemplate");

try {
  dns.setDefaultResultOrder("ipv4first");
} catch {}

/**
 * Sends a custom HTML confirmation email to the client when a meeting is booked.
 */
async function sendBookingConfirmationEmail({
  toEmail,
  inviteeName = "there",
  meetingTitle = "30-Minute Strategy Session",
  dateTime = "Confirmed Time",
  meetLink = "https://meet.google.com",
  rescheduleLink = "https://calendly.com/blinxlab-official/30min",
  cancelLink = "https://calendly.com/blinxlab-official/30min",
}) {
  const html = generateBookingEmail({
    inviteeName,
    meetingTitle,
    dateTime,
    meetLink,
    rescheduleLink,
    cancelLink,
  });

  const subject = `Confirmed: 30-Min Strategy Call with Blinx Lab ✦ ${dateTime}`;

  // 1. Primary Engine: Google Apps Script Webhook (Sends via official blinxlab.official@gmail.com with zero domain needed)
  const gasUrl =
    process.env.GOOGLE_SCRIPT_WEBHOOK_URL ||
    "https://script.google.com/macros/s/AKfycbz2rtHusvRHQ-vy4cyvWRZKt3JfhoVDwGqMYYmhLJA72CL6VAh5awsSw9S-lOtS-EE/exec";

  if (gasUrl) {
    try {
      const gasRes = await axios.post(
        gasUrl,
        JSON.stringify({
          to: toEmail,
          subject,
          html,
        }),
        {
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          timeout: 10000,
        }
      );
      console.log(`[MAILER] ✅ Custom HTML email sent via Google Apps Script to ${toEmail}:`, gasRes.data);
      return { success: true, method: "google_apps_script", data: gasRes.data };
    } catch (err) {
      console.error("[MAILER] Google Apps Script error:", err.response ? err.response.data : err.message);
    }
  }

  // 2. Secondary Engine: Resend HTTPS API (if custom domain configured)
  const resendApiKey = (
    process.env.RESEND_API_KEY ||
    process.env.RESEND_KEY ||
    process.env.resend_api_key ||
    process.env.RESEND ||
    ""
  ).trim();

  if (resendApiKey) {
    try {
      const fromEmail = (process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev").trim();
      const resendRes = await axios.post(
        "https://api.resend.com/emails",
        {
          from: `Blinx Lab <${fromEmail}>`,
          to: [toEmail],
          subject,
          html,
        },
        {
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(`[MAILER] ✅ Email sent via Resend HTTPS to ${toEmail}:`, resendRes.data.id);
      return { success: true, method: "resend", id: resendRes.data.id };
    } catch (err) {
      const errDetails = err.response ? err.response.data : err.message;
      console.error("[MAILER] Resend API error:", errDetails);
    }
  }

  // 2. Fallback to Gmail SMTP
  const user = process.env.GMAIL_USER || "blinxlab.official@gmail.com";
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!pass) {
    console.log(`[MAILER] No email credentials configured.`);
    return { success: false, reason: "No email credentials configured" };
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: user.trim(),
        pass: pass.trim().replace(/\s+/g, ""),
      },
    });

    const info = await transporter.sendMail({
      from: `"Blinx Lab" <${user.trim()}>`,
      to: toEmail,
      subject,
      html,
    });
    console.log(`[MAILER] ✅ Custom HTML email sent via Gmail to ${toEmail}: ${info.messageId}`);
    return { success: true, method: "gmail", messageId: info.messageId };
  } catch (err) {
    console.error(`[MAILER] ❌ Failed to send email to ${toEmail}:`, err.message);
    return { success: false, error: err.message };
  }
}

module.exports = { sendBookingConfirmationEmail };
