const axios = require('axios');

async function sendWhatsAppMessage(to, message) {
  try {
    const response = await axios.post(
      `https://graph.facebook.com/v22.0/${process.env.PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to,
        text: {
          body: message
        }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("✅ WHATSAPP MESSAGE SENT");
    console.log(response.data);

  } catch (err) {
    console.error(
      "🔥 WHATSAPP SEND ERROR:",
      err.response?.data || err.message
    );
  }
}

module.exports = sendWhatsAppMessage;
