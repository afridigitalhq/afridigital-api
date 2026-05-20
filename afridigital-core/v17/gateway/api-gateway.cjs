const bus = require("../spi../../afridigital-core/kernel/event-bus");
const EVENTS = require("../contracts/events");

function handleRequest(req) {
  bus.publish(EVENTS.WHATSAPP_MESSAGE, {
    user: req.user,
    message: req.message
  });
}

module.exports = { handleRequest };
