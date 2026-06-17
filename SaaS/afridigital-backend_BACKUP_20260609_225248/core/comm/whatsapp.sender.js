const fetch = require("node-fetch");

/**
 * AFRISCAN WhatsApp SEND ENGINE
 * Bridges UI → WhatsApp Cloud API
 */

async function sendWhatsAppMessage({ to, message }) {
  const url = `https://graph.facebook.com/v19.0/${process.env.META_PHONE_ID}/messages`;

  const payload = {
    messaging_product: "whatsapp",
    to,
    type: "text",
    text: { body: message }
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.META_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  const data = await res.json();

  console.log("📤 WHATSAPP SENT:", data);

  return data;
}

module.exports = { sendWhatsAppMessage };
