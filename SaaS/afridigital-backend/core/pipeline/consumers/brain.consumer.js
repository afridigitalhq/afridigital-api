const bus = require("../bus/eventBus");
const EVENTS = require("../events/eventTypes");

bus.on(EVENTS.WHATSAPP_MESSAGE_RECEIVED, (event) => {
  const text = event.payload.text;

  console.log("🧠 BRAIN processing:", text);
console.log("📦 RUNTIME TRACE ACTIVE");

  const aiResponse = `Echo: ${text}`;

  bus.emit(EVENTS.AI_RESPONSE_GENERATED, {
    traceId: event.traceId,
    to: event.payload.from,
    text: aiResponse
  });
});
