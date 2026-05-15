/**
 * 📡 A3.18.19 WHATSAPP LIVE CONNECTOR
 * REAL-TIME PRODUCTION PIPELINE (NO SIMULATION)
 */

const { bus } = require("../bus/event.bus");
const { generateReply } = require("../../ai/realtime/reply.engine");
const { sendWhatsAppMessage } = require("../../ai/whatsapp/connector/whatsapp.client");

/**
 * INBOUND → EVENT BUS
 */
function handleIncomingWebhook(req) {

  const body = req.body;

  const event = {
    id: Date.now().toString(),
    type: "WHATSAPP_INBOUND",
    payload: {
      userId: body.from,
      text: body.message
    },
    ts: Date.now()
  };

  bus.publish(event);
  return event;
}

/**
 * AI PIPELINE SUBSCRIPTION
 */
function attachAIPipeline() {

  bus.subscribe("WHATSAPP_INBOUND", async (event) => {

    const replyEvent = generateReply(event);

    bus.publish(replyEvent);
  });
}

/**
 * DELIVERY PIPELINE SUBSCRIPTION
 */
function attachDeliveryPipeline() {

  bus.subscribe("AI_REPLY", async (event) => {

    const to = event.payload.sourceEvent
      ? event.payload.sourceEvent.userId
      : "unknown";

    const message = event.payload.reply;

    await sendWhatsAppMessage(to, message);

    bus.publish({
      type: "WHATSAPP_DELIVERED",
      payload: { to, message },
      ts: Date.now()
    });
  });
}

/**
 * START SYSTEM
 */
function DISABLED_DISABLED {

  attachAIPipeline();
  attachDeliveryPipeline();

  console.log("🚀 A3.18.19 WHATSAPP RUNTIME ACTIVE");
  console.log("📡 LIVE AI RESPONSE MODE ENABLED");
}

module.exports = {
  handleIncomingWebhook,
  startWhatsAppRuntime
};
