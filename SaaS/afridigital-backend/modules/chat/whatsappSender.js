const axios = require("axios");

module.exports = async function sendWhatsApp(to, message) {
  try {
    const url = \`https://graph.facebook.com/v18.0/\${process.env.WHATSAPP_PHONE_ID}/messages\`;

    await axios.post(
      url,
      {
        messaging_product: "whatsapp",
        to,
        text: { body: message }
      },
      {
        headers: {
          Authorization: \`Bearer \${process.env.WHATSAPP_TOKEN}\`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("📤 Sent:", message);
  } catch (err) {
    console.error("❌ Send Error:", err.response?.data || err.message);
  }
};
