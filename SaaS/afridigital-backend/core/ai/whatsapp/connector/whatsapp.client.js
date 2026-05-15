/**
 * 📡 A3.18.16 WHATSAPP REAL CLIENT (CLOUD API ADAPTER)
 * Replace TOKEN + PHONE_ID later in env
 */



const TOKEN = process.env.WHATSAPP_TOKEN || "TEST_TOKEN";
const PHONE_ID = process.env.WHATSAPP_PHONE_ID || "TEST_PHONE_ID";

async function sendWhatsAppMessage(to, message) {

  const url = `https://graph.facebook.com/v19.0/${PHONE_ID}/messages`;

  const payload = {
    messaging_product: "whatsapp",
    to,
    type: "text",
    text: { body: message }
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  return res.json();
}

module.exports = { sendWhatsAppMessage };
