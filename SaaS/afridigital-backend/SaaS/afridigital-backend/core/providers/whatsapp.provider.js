const { assertApiVersion } = require("../runtime/safety/api.guard");
require('dotenv').config();

async function sendMessage(to, message) {

  console.log('🟢 WhatsApp Provider Sending');
  console.log('TO:', to);

  return {
    success: true
  };
}

function verifyWebhook(mode, token) {

  return (
    mode === 'subscribe' &&
    token === process.env.WHATSAPP_VERIFY_TOKEN
  );
}

module.exports = {
  sendMessage,
  verifyWebhook
};
