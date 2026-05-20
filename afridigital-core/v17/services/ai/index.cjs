const bus = require("../../spi../../afridigital-core/kernel/event-bus");
const EVENTS = require("../../contracts/events");

bus.on(EVENTS.WHATSAPP_MESSAGE, (data) => {
  const response = {
    reply: `AI RESPONSE: processed -> ${data.message}`
  };

  bus.publish(EVENTS.AI_RESPONSE, response);
});
