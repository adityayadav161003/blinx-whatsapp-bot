const nodemailer = require("nodemailer");
const { generateBookingEmail } = require("./emailTemplate");

// Create reusable transporter object using Gmail SMTP
let transporter = null;

function getTransporter() {
  if (!transporter && process.env.GMAIL_APP_PASSWORD) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER || "blinxlab.official@gmail.com",
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
  }
  return transporter;
}

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

  const mailClient = getTransporter();

  if (!mailClient) {
    console.log(`[MAILER] Custom HTML email generated for ${toEmail} (GMAIL_APP_PASSWORD not set).`);
    return { success: false, reason: "GMAIL_APP_PASSWORD not configured" };
  }

  try {
    const info = await mailClient.sendMail({
      from: `"Blinx Lab" <${process.env.GMAIL_USER || "blinxlab.official@gmail.com"}>`,
      to: toEmail,
      subject: `Confirmed: 30-Min Strategy Call with Blinx Lab ✦ ${dateTime}`,
      html,
    });
    console.log(`[MAILER] ✅ Custom HTML confirmation email sent to ${toEmail}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error(`[MAILER] ❌ Failed to send email to ${toEmail}:`, err.message);
    return { success: false, error: err.message };
  }
}

module.exports = { sendBookingConfirmationEmail };
