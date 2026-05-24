const bus = require("../spi../../afridigital-core/kern../../afridigital-core/kernel/events");
const EVENTS = require("../contracts/events");

function handleRequest(req) {
  bus.publish(EVENTS.WHATSAPP_MESSAGE, {
    user: req.user,
    message: req.message
  });
}

module.exports = { handleRequest };
