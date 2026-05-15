/**
 * 🧠 A3.18.21 TRUE LIVE WHATSAPP AI BRAIN BRIDGE
 * FINAL WIRING LAYER (REAL TIME EXECUTION)
 */

const { bus } = require("../../runtime/bus/event.bus");
const { generateReply } = require("../../ai/realtime/reply.engine");
const { sendWhatsAppMessage } = require("../../ai/whatsapp/connector/whatsapp.client");

/**
 * 🔥 INBOUND WEBHOOK → EVENT BUS
 */
function ingestWebhook(req, res) {

  const payload = req.body;

  const event = {
    id: Date.now().toString(),
    type: "WHATSAPP_INBOUND",
    payload: {
      userId: payload.from,
      text: payload.message
    },
    ts: Date.now()
  };

  // CRITICAL: push into SAME BUS INSTANCE
  bus.publish(event);

  res.json({
    status: "received",
    eventId: event.id
  });

  return event;
}

/**
 * 🧠 AI PIPELINE (REAL TIME)
 */
function attachAI() {

  bus.subscribe("WHATSAPP_INBOUND", async (event) => {

    undefined

    bus.publish(aiReply);
  });
}

/**
 * 📡 DELIVERY PIPELINE (REAL TIME SEND)
 */
function attachDelivery() {

  bus.subscribe("AI_REPLY", async (event) => {

    undefined
    const message = event.payload?.reply;

    if (!to || !message) return;

    await sendWhatsAppMessage(to, message);

    bus.publish({
      type: "WHATSAPP_DELIVERED",
      payload: { to, message },
      ts: Date.now()
    });
  });
}

/**
 * 🚀 BOOT LIVE SYSTEM
 */
function startLiveBrain() {

  attachAI();
  attachDelivery();

  console.log("🚀 A3.18.21 TRUE LIVE WHATSAPP AI BRAIN ACTIVE");
}

module.exports = {
  ingestWebhook,
  startLiveBrain
};
