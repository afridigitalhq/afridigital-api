async function sendMessage(to, text) {
  try {
    const url = `https://graph.facebook.com/v19.0/${process.env.META_PHONE_NUMBER_ID}/messages`;

    const payload = {
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { body: text }
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${require("../core/kernel/config/loader").whatsapp.accessToken}`
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    console.log('📤 WHATSAPP SENT:', data);

    return data;
  } catch (err) {
    console.error('SEND_MESSAGE_ERROR:', err.message);
    return { success: false };
  }
}

module.exports = { sendMessage };
