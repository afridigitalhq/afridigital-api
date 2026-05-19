const bus = require("../bus/eventBus");
const EVENTS = require("../events/eventTypes");

bus.on(EVENTS.AI_RESPONSE_GENERATED, (event) => {
  console.log("📤 DELIVERY sending to WhatsApp:", event.payload);

  bus.emit(EVENTS.MESSAGE_DELIVERED, {
    traceId: event.traceId,
    status: "SENT",
    to: event.payload.to
  });
});
