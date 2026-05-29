const axios = require("axios");

/**
 * WhatsApp Gateway Adapter
 * (plug in your provider: Twilio / Meta / 360dialog / custom API)
 */

const BASE_URL = process.env.WHATSAPP_GATEWAY_URL;
const TOKEN = process.env.WHATSAPP_GATEWAY_TOKEN;

/**
 * Send initial message (creates message session)
 */
async function sendMessage(to, text) {
  if (!BASE_URL) {
    console.log("⚠️ WhatsApp gateway not configured");
    return;
  }

  const res = await axios.post(
    `${BASE_URL}/send`,
    {
      to,
      text
    },
    {
      headers: {
        Authorization: `Bearer ${TOKEN}`
      }
    }
  );

  return res.data;
}

/**
 * Edit / update message (for streaming effect)
 */
async function updateMessage(messageId, text) {
  if (!BASE_URL) return;

  const res = await axios.post(
    `${BASE_URL}/edit`,
    {
      messageId,
      text
    },
    {
      headers: {
        Authorization: `Bearer ${TOKEN}`
      }
    }
  );

  return res.data;
}

module.exports = {
  sendMessage,
  updateMessage
};
