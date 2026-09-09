const axios = require("axios");

const GRAPH_VERSION = "v21.0";

function apiUrl() {
  return `https://graph.facebook.com/${GRAPH_VERSION}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;
}

async function sendText(to, body, previewUrl = true) {
  try {
    return await axios.post(
      apiUrl(),
      {
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { preview_url: previewUrl, body },
      },
      { headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}` } }
    );
  } catch (err) {
    console.error("[WHATSAPP SEND ERROR]:", err.response ? err.response.data : err.message);
    throw err;
  }
}

// Sends a message with tappable quick-reply buttons (max 3 buttons, short labels).
async function sendButtons(to, bodyText, buttons) {
  return axios.post(
    apiUrl(),
    {
      messaging_product: "whatsapp",
      to,
      type: "interactive",
      interactive: {
        type: "button",
        body: { text: bodyText },
        action: {
          buttons: buttons.map((b, i) => ({
            type: "reply",
            reply: { id: b.id || `btn_${i}`, title: b.title.slice(0, 20) },
          })),
        },
      },
    },
    { headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}` } }
  );
}

// Sends an interactive Call-to-Action (CTA) URL button that directly opens a link on tap.
async function sendUrlButton(to, bodyText, buttonTitle, url, headerText = null, footerText = null) {
  try {
    const interactive = {
      type: "cta_url",
      body: { text: bodyText },
      action: {
        name: "cta_url",
        parameters: {
          display_text: buttonTitle.slice(0, 20),
          url: url,
        },
      },
    };
    if (headerText) interactive.header = { type: "text", text: headerText.slice(0, 60) };
    if (footerText) interactive.footer = { text: footerText.slice(0, 60) };

    return await axios.post(
      apiUrl(),
      {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to,
        type: "interactive",
        interactive,
      },
      { headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}` } }
    );
  } catch (err) {
    console.error("[WHATSAPP CTA URL ERROR]:", err.response ? err.response.data : err.message);
    throw err;
  }
}

async function markAsRead(messageId) {
  return axios.post(
    apiUrl(),
    { messaging_product: "whatsapp", status: "read", message_id: messageId },
    { headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}` } }
  );
}

module.exports = { sendText, sendButtons, sendUrlButton, markAsRead };
