async function sendWhatsAppMessage(to, message) {
  console.log("📤 SENDER:", { to, message });

  try {
    const resp = await fetch(
      `https://graph.facebook.com/v19.0/${process.env.META_PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.META_ACCESS_TOKEN}`
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to,
          type: "text",
          text: { body: message }
        })
      }
    );

    const body = await resp.text();
    console.log("📡 WHATSAPP RESPONSE:", body);

    return body;
  } catch (e) {
    console.log("SEND ERROR:", e.message);
  }
}

module.exports = { sendWhatsAppMessage };
