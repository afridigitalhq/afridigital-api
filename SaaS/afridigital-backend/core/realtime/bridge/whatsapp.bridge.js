/**
 * 📩 WHATSAPP → CONTROL TOWER BRIDGE
 * Converts WhatsApp messages into system events
 */

const { emit } = require("../../runtime/eventbus/afriscan.bus");

function pushWhatsAppEvent(event) {
  return emit("whatsapp:message", {
    from: event.data.from,
    message: event.data.message,
    source: "whatsapp"
  });
}

module.exports = {
  pushWhatsAppEvent
};
