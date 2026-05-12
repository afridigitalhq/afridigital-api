const axios = require("axios");

// 🔐 ENV VARIABLES (set these in Render)
const TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

async function sendMessage(to, text) {
  try {
    const url = `https://graph.facebook.com/v19.0/${PHONE_NUMBER_ID}/messages`;

    const payload = {
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body: text }
    };

    const res = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json"
      }
    });

    console.log("📤 SENT:", res.data);
    return res.data;

  } catch (err) {
    console.log("💥 META SEND ERROR:", err.response?.data || err.message);
  }
}

module.exports = { sendMessage };
