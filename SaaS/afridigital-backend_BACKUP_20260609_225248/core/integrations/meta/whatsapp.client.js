/**
 * 📡 META WHATSAPP CLOUD API CLIENT (PRODUCTION)
 */

const axios = require("axios");

const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;

async function sendMessage(to, message) {
  try {
    const url = `https://graph.facebook.com/v20.0/${PHONE_NUMBER_ID}/messages`;

    const payload = {
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: {
        body: message
      }
    };

    const res = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json"
      }
    });

    return {
      success: true,
      metaResponse: res.data
    };

  } catch (err) {
    console.error("❌ META WHATSAPP ERROR:", err.response?.data || err.message);

    return {
      success: false,
      error: err.response?.data || err.message
    };
  }
}

module.exports = {
  sendMessage
};
