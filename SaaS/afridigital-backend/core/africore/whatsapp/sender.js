const axios = require("axios");

async function sendMessage(to, text) {
  if (!process.env.WHATSAPP_TOKEN || !process.env.WHATSAPP_PHONE_ID) {
    console.log("⚠️ WhatsApp not configured");
    return { ok: false };
  }

  try {
    const url = `https://graph.facebook.com/v19.0/${process.env.WHATSAPP_PHONE_ID}/messages`;

    const res = await axios.post(url, {
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body: text }
    }, {
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
        "Content-Type": "application/json"
      }
    });

    return { ok: true, data: res.data };
  } catch (e) {
    console.log("WhatsApp send error:", e.message);
    return { ok: false, error: e.message };
  }
}

module.exports = { sendMessage };
