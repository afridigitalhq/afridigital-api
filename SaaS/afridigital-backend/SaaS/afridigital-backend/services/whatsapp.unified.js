const axios = require("axios");

async function sendWhatsAppMessage({ to, message }) {
  try {

    // PLACEHOLDER (YOU WILL ADD REAL META TOKEN LATER)
    const TOKEN = process.env.WHATSAPP_TOKEN || "DUMMY_TOKEN";
    const PHONE_ID = process.env.WHATSAPP_PHONE_ID || "DUMMY_PHONE";

    console.log("📡 SENDING TO WHATSAPP CLOUD API:", to);

    // SAFE MOCK MODE (NO FAILURES YET)
    if (TOKEN === "DUMMY_TOKEN") {
      console.log("⚠️ CLOUD API NOT CONFIGURED (MOCK MODE)");
      return { ok: true, mode: "mock", to, message };
    }

    const response = await axios.post(
      `https://graph.facebook.com/v19.0/${PHONE_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body: message }
      },
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    return { ok: true, mode: "live", data: response.data };

  } catch (err) {
    console.log("❌ WHATSAPP SEND ERROR:", err.message);
    return { ok: false, error: err.message };
  }
}

module.exports = sendWhatsAppMessage;
