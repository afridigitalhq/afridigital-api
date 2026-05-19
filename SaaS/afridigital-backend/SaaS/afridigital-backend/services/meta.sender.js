const axios = require("axios");

const TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

async function sendMessage(to, text) {
  try {
    console.log("📡 META SEND INIT:", { to, text });

    if (!TOKEN || !PHONE_NUMBER_ID) {
      throw new Error("Missing WHATSAPP_TOKEN or PHONE_NUMBER_ID");
    }

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

    console.log("📤 META SUCCESS:", res.data);
    return res.data;

  } catch (err) {
    console.log("💥 META SEND ERROR FULL:", err.response?.data || err.message);
    throw err;
  }
}

module.exports = { sendMessage };
