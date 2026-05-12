const axios = require("axios");

/**
 * Simple WhatsApp Cloud API sender
 * ENV required:
 * - WHATSAPP_TOKEN
 * - WHATSAPP_PHONE_NUMBER_ID
 */
async function sendWhatsApp(to, message) {
  try {
    const url = `https://graph.facebook.com/v23.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;

    const payload = {
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body: message }
    };

    const res = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
        "Content-Type": "application/json"
      }
    });

    console.log("📤 WhatsApp sent:", res.data);
    return res.data;

  } catch (err) {
    console.error("❌ WhatsApp send error:", err?.response?.data || err.message);
    return null;
  }
}

module.exports = sendWhatsApp;
