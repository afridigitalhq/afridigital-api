const axios = require('axios');

module.exports = async function sendWhatsApp(to, message) {
  try {
    const phoneNumberId = process.env.META_PHONE_NUMBER_ID;
    const token = process.env.META_ACCESS_TOKEN;

    if (!phoneNumberId || !token) {
      console.error("❌ Missing Meta credentials");
      return { success: false, error: "Missing META config" };
    }

    const url = `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`;

    const payload = {
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: {
        body: message
      }
    };

    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    console.log("📡 META RESPONSE:", response.data);

    return {
      success: true,
      mock: false,
      meta: response.data
    };

  } catch (err) {
    console.error("❌ WhatsApp SEND ERROR:", err.response?.data || err.message);

    return {
      success: false,
      error: err.response?.data || err.message
    };
  }
};
