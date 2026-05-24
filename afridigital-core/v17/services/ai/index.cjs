const bus = require("../../spi../../afridigital-core/kern../../afridigital-core/kernel/events");
const EVENTS = require("../../contracts/events");

bus.on(EVENTS.WHATSAPP_MESSAGE, (data) => {
  const response = {
    reply: `AI RESPONSE: processed -> ${data.message}`
  };

  bus.publish(EVENTS.AI_RESPONSE, response);
});
