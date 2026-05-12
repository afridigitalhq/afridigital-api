const { assertApiVersion } = require("../runtime/safety/api.guard");
const axios = require('axios');

async function sendWhatsAppMessage(to, text) {
  try {

    const url = `graph("")${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;

    const payload = {
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body: text }
    };

    const res = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
        "Content-Type": "application/json"
      }
    });

    console.log("📤 SENT SUCCESS:", res.data);
    return res.data;

  } catch (err) {
    console.error("❌ SEND FAILED:", err.response?.data || err.message);
    return null;
  }
}

module.exports = { sendWhatsAppMessage };
