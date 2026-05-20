const bus = require("../bus/eventBus");
const EVENTS = require("../events/eventTypes");

bus.on(EVENTS.AI_RESPONSE_GENERATED, (event) => {
  console.log("📤 DELIVERY sending to WhatsApp:", event.payload);
console.log("📦 RUNTIME TRACE ACTIVE");
console.log("📡 META SEND ATTEMPT TRACE:", JSON.stringify(event, null, 2));
console.log("📦 RUNTIME TRACE ACTIVE");

  bus.emit(EVENTS.MESSAGE_DELIVERED, {
    traceId: event.traceId,
    status: "SENT",
    to: event.payload.to
  });
});
