/* BUS_SINGLETON_GUARD */
/**
 * 🧠 A3.18.21 TRUE LIVE WHATSAPP AI BRAIN BRIDGE
 * FINAL WIRING LAYER (REAL TIME EXECUTION)
 */

const { bus } = require("../bus/event.bus");
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


    undefined

    console.log('🧠 AI_REPLY GENERATED:', aiReply);
  bus.publish(aiReply);
  });
}

/**
 * 📡 DELIVERY PIPELINE (REAL TIME SEND)
 */
function attachDelivery() {

  bus.subscribe("AI_REPLY", async (event) => {
  console.log('📦 AI_REPLY RECEIVED:', event);, async (event) => {

    undefined
    const message = event.payload?.reply;

    if (!to || !message) return;

    console.log('📡 SENDING WHATSAPP:', { to, message });
  await sendWhatsAppMessage(to, message);
  console.log('✅ WHATSAPP SENT');

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
app.use('/whatsapp', require('../../routes/whatsapp.webhook'));
