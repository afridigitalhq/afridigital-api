const bus = require("../../afridigital-core/kern../../afridigital-core/kern../../afridigital-core/kernel/events/event.bus.cjs.cjs");
const EVENTS = require("../../afridigital-core/kernel/event-bus/eventTypes");

bus.on(EVENTS.WHATSAPP_MESSAGE_RECEIVED, (e) => {
  console.log("📩 RECEIVED:", e);
});

bus.on(EVENTS.AI_RESPONSE_GENERATED, (e) => {
  console.log("🧠 AI:", e);
});

bus.on(EVENTS.MESSAGE_DELIVERED, (e) => {
  console.log("✅ DELIVERED:", e);
});

bus.on(EVENTS.ERROR_OCCURRED, (e) => {
  console.error("❌ ERROR:", e);
});
