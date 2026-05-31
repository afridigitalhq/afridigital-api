const axios = require("axios");

async function send(to, text) {
  const token = process.env.WHATSAPP_TOKEN;

  if (!token) {
    console.log("[WHATSAPP MOCK SEND]", { to, text });
    return;
  }

  try {
    await axios.post(
      "https://graph.facebook.com/v19.0/me/messages",
      {
        messaging_product: "whatsapp",
        to,
        text: { body: text }
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );
  } catch (e) {
    console.log("[WHATSAPP SEND FAILED]", e.message);
    throw e;
  }
}

module.exports = { send };
