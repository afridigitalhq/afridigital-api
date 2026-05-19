

/**
 * 🚀 AFRIDIGITAL WHATSAPP CLOUD API ADAPTER
 * Replace ENV values with your Meta credentials
 */

const TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_ID = process.env.WHATSAPP_PHONE_ID;

async function sendWhatsAppMessage(to, message) {
  try {
    const url = `https://graph.facebook.com/v18.0/${PHONE_ID}/messages`;

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body: message }
      })
    });

    const data = await res.json();

    console.log("📡 WA CLOUD RESPONSE:", data);

    return data;
  } catch (err) {
    console.error("❌ WHATSAPP SEND ERROR:", err);
    return { ok: false, error: err.message };
  }
}

module.exports = { sendWhatsAppMessage };
