const axios = require("axios");

const TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_ID = process.env.PHONE_NUMBER_ID;

async function sendMessage(to, text) {
  return axios.post(
    `https://graph.facebook.com/v23.0/${PHONE_ID}/messages`,
    {
      messaging_product: "whatsapp",
      to,
      text: { body: text }
    },
    {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json"
      }
    }
  );
}

module.exports = { sendMessage };
