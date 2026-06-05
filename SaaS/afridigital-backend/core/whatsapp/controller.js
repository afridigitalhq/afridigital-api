const bus = require("../kernel/events/eventBus");
const { detectIntent } = require("./intent");

async function handleMessage(payload) {
  const message = payload?.text || payload?.body || "";

  const intent = detectIntent(message);

  const event = {
    source: "whatsapp",
    message,
    intent,
    raw: payload,
    ts: Date.now()
  };

  console.log("📡 WhatsApp Event:", event.intent);

  bus.emit("whatsapp.message", event);
  bus.emit("flow.execute", event);
}

module.exports = { handleMessage };
