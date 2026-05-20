const bus = require("../../afridigital-core/kern../../afridigital-core/kern../../afridigital-core/kernel/events/event.bus.cjs.cjs");
const EVENTS = require("../../afridigital-core/kernel/event-bus/eventTypes");

const brain = require("../../brain/v3");

bus.on(EVENTS.WHATSAPP_MESSAGE_RECEIVED, async (e) => {
  try {
    const result = await brain.processMessage({
      body: { message: e.text, from: e.from }
    });

    bus.emit(EVENTS.AI_RESPONSE_GENERATED, {
      from: e.from,
      reply: result.reply
    });

  } catch (err) {
    bus.emit(EVENTS.ERROR_OCCURRED, {
      source: "brain",
      error: err.message
    });
  }
});
