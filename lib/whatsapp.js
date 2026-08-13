const axios = require("axios");

const GRAPH_VERSION = "v21.0";

function apiUrl() {
  return `https://graph.facebook.com/${GRAPH_VERSION}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;
}

async function sendText(to, body) {
  return axios.post(
    apiUrl(),
    {
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body },
    },
    { headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}` } }
  );
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

async function markAsRead(messageId) {
  return axios.post(
    apiUrl(),
    { messaging_product: "whatsapp", status: "read", message_id: messageId },
    { headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}` } }
  );
}

module.exports = { sendText, sendButtons, markAsRead };
