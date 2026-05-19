/**
 * 🌐 A3.18.15 WEBHOOK BRIDGE
 * REAL-TIME ENTRY POINT INTO AFRIAI BRAIN
 */

const { createEvent } = require("../event/types");
const { attachRealtimeAI } = require("../router/attach.realtime");

/**
 * Incoming webhook → normalized AI event
 */
function handleWebhook(payload, bus) {

  if (!payload) return null;

  const event = createEvent("WHATSAPP_INBOUND", {
    userId: payload.from,
    text: payload.message,
    raw: payload
  });

  // inject into realtime pipeline
  attachRealtimeAI(bus);

  if (typeof bus.emit === "function") {
    bus.emit(event);
  }

  return event;
}

/**
 * Generic API hook (future multi-channel support)
 */
function handleApiRequest(req, bus) {

  return handleWebhook({
    from: req.body?.from,
    message: req.body?.message
  }, bus);

}

module.exports = {
  handleWebhook,
  handleApiRequest
};
