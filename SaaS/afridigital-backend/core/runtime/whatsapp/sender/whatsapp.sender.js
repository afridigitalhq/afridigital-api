const { assertApiVersion } = require("../../safety/api.guard");
const axios = require('axios');

async function sendWhatsAppMessage(to, text) {
  try {
    const url = `graph("")${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;

    const response = await axios.post(
      url,
      {
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body: text }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log('📤 MESSAGE SENT:', response.data);
    return response.data;

  } catch (err) {
    console.error('❌ WHATSAPP SEND ERROR:', err.response?.data || err.message);
  }
}

module.exports = { sendWhatsAppMessage };
