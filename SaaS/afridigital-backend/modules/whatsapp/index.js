const axios = require("axios");

const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

module.exports = {
  async sendMessage(to, message) {
    if (!WHATSAPP_TOKEN || !PHONE_NUMBER_ID) {
      return { ok: false, error: "missing_env" };
    }

    const url = `https://graph.facebook.com/v19.0/${PHONE_NUMBER_ID}/messages`;

    return axios.post(url, {
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body: message }
    }, {
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        "Content-Type": "application/json"
      }
    }).then(r => r.data);
  }
};
