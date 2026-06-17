const { emit } = require("../unified/event.bus");

function ingestWhatsApp(message) {
  emit({
    type: "whatsapp_inbound",
    payload: {
      from: message.from,
      text: message.text
    }
  });
}

function sendWhatsApp(to, text) {
  emit({
    type: "whatsapp_outbound",
    payload: { to, text }
  });
}

module.exports = { ingestWhatsApp, sendWhatsApp };
