/**
 * 🔁 A3.18.16 SEND BRIDGE
 * Connects queue → real WhatsApp API
 */

const { sendWhatsAppMessage } = require("./whatsapp.client");

function sendMessageToWhatsApp(task) {
  return sendWhatsAppMessage(
    task.payload?.to || task.to,
    task.payload?.body || task.message
  );
}

module.exports = { sendMessageToWhatsApp };
