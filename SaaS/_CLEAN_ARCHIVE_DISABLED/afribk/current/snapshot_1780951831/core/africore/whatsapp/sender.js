const axios = require("axios");

async function sendMessage(to, text) {
  if (!config.get("whatsapp.token") || !config.get("whatsapp.phoneId")) {
    console.log("⚠️ WhatsApp not configured");
    return { ok: false };
  }

  try {
    const url = `https://graph.facebook.com/v19.0/${config.get("whatsapp.phoneId")}/messages`;

    const res = await axios.post(url, {
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body: text }
    }, {
      headers: {
        Authorization: `Bearer ${config.get("whatsapp.token")}`,
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
