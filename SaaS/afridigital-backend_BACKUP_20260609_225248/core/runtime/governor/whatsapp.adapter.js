/**
 * 📡 WHATSAPP SAFE ADAPTER
 * ensures WhatsApp never executes system logic directly
 */

const { normalize } = require("../schema/event.schema");

function toEvent(message) {
  return normalize("whatsapp_inbound", {
    from: message.from,
    text: message.text
  });
}

module.exports = {
  toEvent
};
