const bus = require("../../afridigital-core/kern../../afridigital-core/kern../../afridigital-core/kernel/events/event.bus.cjs.cjs");
const EVENTS = require("../../afridigital-core/kernel/event-bus/eventTypes");

const delivery = require("../../services/whatsapp-gateway/core/delivery/deliveryEngine");

bus.on(EVENTS.AI_RESPONSE_GENERATED, async (e) => {
  try {
    await delivery.deliver(e.from, e.reply);

    bus.emit(EVENTS.MESSAGE_DELIVERED, {
      to: e.from,
      reply: e.reply
    });

  } catch (err) {
    bus.emit(EVENTS.ERROR_OCCURRED, {
      source: "delivery",
      error: err.message
    });
  }
});
