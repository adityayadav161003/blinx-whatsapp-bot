/**
 * Premium Bulletproof Email Template for Blinx Lab
 * 100% Inlined Hybrid-Table Architecture designed for flawless rendering
 * on Android Gmail, iPhone Mail, Samsung Email, Outlook, and Desktop browsers.
 */

function generateBookingEmail({
  inviteeName = "there",
  meetingTitle = "30-Minute Strategy Session",
  dateTime = "Scheduled Date & Time",
  meetLink = "https://meet.google.com",
  rescheduleLink = "https://calendly.com/blinxlab-official/30min",
  cancelLink = "https://calendly.com/blinxlab-official/30min",
}) {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="light dark" />
  <meta name="supported-color-schemes" content="light dark" />
  <title>Confirmed: Strategy Session with Blinx Lab</title>
  <style type="text/css">
    /* Global Resets */
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #0a0a0a; color: #ffffff; }
    
    /* Dark Mode Anti-Inversion Overrides */
    :root { color-scheme: light dark; supported-color-schemes: light dark; }
    @media (prefers-color-scheme: dark) {
      body, .bg-body { background: #0a0a0a !important; background-color: #0a0a0a !important; }
      .bg-container { background: #141414 !important; background-color: #141414 !important; }
      .bg-card { background: #1b1b1b !important; background-color: #1b1b1b !important; }
      .text-white { color: #ffffff !important; }
      .text-gray { color: #cccccc !important; }
      .text-gold { color: #f5b041 !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">

  <!-- Outer Full-Width Wrapper Table -->
  <table border="0" cellpadding="0" cellspacing="0" width="100%" class="bg-body" style="background-color: #0a0a0a; width: 100%; table-layout: fixed;">
    <tr>
      <td align="center" style="padding: 20px 12px 40px 12px;">
        
        <!-- Main Email Container Table (Max 560px width, 100% on Mobile) -->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" class="bg-container" style="max-width: 560px; width: 100%; background-color: #141414; border: 1px solid #262626; border-radius: 16px; overflow: hidden; table-layout: fixed;">
          
          <!-- Header Banner -->
          <tr>
            <td align="center" style="padding: 32px 20px 22px 20px; background-color: #1a1a1a; border-bottom: 1px solid #222222;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center">
                    <h2 style="font-size: 30px; font-weight: 900; color: #ffffff; margin: 0; letter-spacing: -0.5px; line-height: 1;">
                      blin<span style="color: #ff3366;">x</span><span style="color: #f5b041;">_</span>
                    </h2>
                    <div style="font-size: 11px; color: #888888; text-transform: uppercase; letter-spacing: 2px; margin-top: 6px; font-weight: 700;">
                      High-Velocity Creative &amp; Growth Agency
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body Content Area -->
          <tr>
            <td style="padding: 28px 22px 32px 22px; background-color: #141414;">
              
              <!-- Greeting & Intro -->
              <h1 class="text-white" style="font-size: 22px; font-weight: 700; margin: 0 0 14px 0; color: #ffffff; line-height: 1.3;">
                Confirmed: Strategy Session
              </h1>
              <p class="text-gray" style="font-size: 15px; line-height: 1.6; color: #cccccc; margin: 0 0 16px 0;">
                Hey <strong>${inviteeName}</strong>,
              </p>
              <p class="text-gray" style="font-size: 15px; line-height: 1.6; color: #cccccc; margin: 0 0 22px 0;">
                Thanks for booking a session with <strong>Blinx Lab</strong>. We engineer high-performance creative, websites, and growth infrastructure built to break the algorithm.
              </p>

              <!-- Meeting Details Card Table (100% Full Width on Android & iPhone) -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" class="bg-card" style="background-color: #1b1b1b; border: 1px solid #2b2b2b; border-radius: 12px; margin-bottom: 24px; width: 100%;">
                <tr>
                  <td style="padding: 18px 20px;">
                    
                    <!-- Session -->
                    <div style="margin-bottom: 14px;">
                      <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #888888; margin-bottom: 4px;">
                        Session
                      </div>
                      <div class="text-white" style="font-size: 15px; font-weight: 700; color: #ffffff; line-height: 1.4;">
                        ${meetingTitle}
                      </div>
                    </div>

                    <!-- Date & Time (Highlighted Gold) -->
                    <div style="margin-bottom: 14px;">
                      <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #888888; margin-bottom: 4px;">
                        Date &amp; Time
                      </div>
                      <div class="text-gold" style="font-size: 16px; font-weight: 700; color: #f5b041; line-height: 1.4;">
                        ${dateTime}
                      </div>
                    </div>

                    <!-- Location -->
                    <div>
                      <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #888888; margin-bottom: 4px;">
                        Location
                      </div>
                      <div class="text-white" style="font-size: 15px; font-weight: 700; color: #ffffff; line-height: 1.4;">
                        Google Meet (Video Call)
                      </div>
                    </div>

                  </td>
                </tr>
              </table>

              <!-- Main Primary CTA Button (Join Call) -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 24px;">
                <tr>
                  <td align="center" style="background-color: #ff3366; border-radius: 10px;">
                    <a href="${meetLink}" target="_blank" style="display: block; width: 100%; padding: 16px 20px; font-size: 16px; font-weight: 700; color: #ffffff !important; text-decoration: none; text-align: center; box-sizing: border-box; letter-spacing: 0.3px;">
                      Join Google Meet Session
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Agenda Section Table -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-top: 1px solid #222222; padding-top: 20px; margin-bottom: 24px;">
                <tr>
                  <td style="padding-top: 20px;">
                    <div class="text-gold" style="font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; color: #f5b041; font-weight: 700; margin-bottom: 12px;">
                      &#10022; What We'll Cover on This Call
                    </div>
                    <div style="margin-bottom: 10px; font-size: 14px; line-height: 1.5; color: #bbbbbb;">
                      <strong style="color: #ff3366; margin-right: 6px;">01.</strong> Current bottleneck breakdown (website, branding, paid ads, or SMM)
                    </div>
                    <div style="margin-bottom: 10px; font-size: 14px; line-height: 1.5; color: #bbbbbb;">
                      <strong style="color: #ff3366; margin-right: 6px;">02.</strong> Creative &amp; high-velocity growth roadmap
                    </div>
                    <div style="font-size: 14px; line-height: 1.5; color: #bbbbbb;">
                      <strong style="color: #ff3366; margin-right: 6px;">03.</strong> Tailored project scope, timeline &amp; direct quote
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Reschedule & Cancel Action Buttons -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-top: 1px solid #222222; padding-top: 18px;">
                <tr>
                  <td style="padding-top: 18px;">
                    <p style="font-size: 13px; color: #888888; margin: 0 0 12px 0;">
                      Need to make changes to your time?
                    </p>
                    <table border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding-right: 10px; padding-bottom: 8px;">
                          <a href="${rescheduleLink}" target="_blank" style="display: inline-block; padding: 10px 16px; background-color: #222222; border: 1px solid #333333; color: #cccccc !important; text-decoration: none; border-radius: 8px; font-size: 13px; font-weight: 600;">
                            Reschedule Time
                          </a>
                        </td>
                        <td style="padding-bottom: 8px;">
                          <a href="${cancelLink}" target="_blank" style="display: inline-block; padding: 10px 16px; background-color: #221517; border: 1px solid #441c22; color: #ff6685 !important; text-decoration: none; border-radius: 8px; font-size: 13px; font-weight: 600;">
                            Cancel Session
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding: 20px 20px; background-color: #0d0d0d; border-top: 1px solid #1e1e1e; text-align: center;">
              <p style="margin: 0 0 6px 0; color: #888888; font-size: 13px;">
                <strong>Blinx Lab</strong> &bull; <a href="https://blinxlab.in/" target="_blank" style="color: #888888; text-decoration: none;">blinxlab.in</a>
              </p>
              <p style="margin: 0; color: #555555; font-size: 11px;">
                Contact: blinxlab.official@gmail.com | Mathura / India
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>`;
}

module.exports = { generateBookingEmail };
