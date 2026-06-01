const axios = require("axios");

/**
 * WhatsApp Gateway Adapter (plug your provider here)
 * - Twilio / Meta Cloud API / 360dialog all compatible
 */
async function sendWhatsAppMessage(to, text) {

  try {
    await axios.post(config.get("whatsapp.apiUrl"), {
      to,
      text
    }, {
      headers: {
        Authorization: `Bearer ${config.get("whatsapp.token")}`,
        "Content-Type": "application/json"
      }
    });

  } catch (err) {
    console.log("❌ WhatsApp send failed:", err.message);
  }
}

module.exports = { sendWhatsAppMessage };
