const isSafe = () => process.env.SAFE_MODE === "true";
const axios = require("axios");

const TOKEN = process.env.META_TOKEN;
const PHONE_ID = process.env.META_PHONE_ID;

if (!TOKEN || !PHONE_ID) {
  console.warn("⚠️ WhatsApp running in SAFE MODE (missing env)");
}

async function sendMessage(to, text) {
  if (!TOKEN || !PHONE_ID) {
    console.log("🧪 MOCK SEND →", { to, text });
    return { mock: true };
  }

  const url = `https://graph.facebook.com/v19.0/${PHONE_ID}/messages`;

  try {
    const res = await axios.post(
      url,
      {
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body: text }
      },
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    return res.data;
  } catch (err) {
    console.error("❌ WhatsApp send error:", err.response?.data || err.message);
    throw err;
  }
}

module.exports = { sendMessage };
