const axios = require('axios');

async function sendWhatsAppMessage(to, message) {
  try {
    const url = `https://graph.facebook.com/v22.0/${process.env.PHONE_NUMBER_ID}/messages`;

    const payload = {
      messaging_product: "whatsapp",
      to: to,
      text: {
        body: message
      }
    };

    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
        "Content-Type": "application/json"
      }
    });

    console.log("✅ WHATSAPP SENT:", response.data);

    return response.data;

  } catch (err) {
    console.error(
      "🔥 WHATSAPP SEND ERROR:",
      err.response?.data || err.message
    );
  }
}

module.exports = sendWhatsAppMessage;
