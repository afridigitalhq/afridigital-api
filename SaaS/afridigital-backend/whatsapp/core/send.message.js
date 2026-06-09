/**
 * 📱 WHATSAPP SENDER (NOW PRODUCTION READY)
 */

const { sendMessage } = require("../../core/integrations/meta/whatsapp.client");

async function sendWhatsAppMessage({ to, message }) {
  console.log("📱 META SEND INIT:", to);

  const result = await sendMessage(to, message);

  console.log("📡 META RESPONSE:", result);

  return result;
}

module.exports = {
  sendWhatsAppMessage
};
