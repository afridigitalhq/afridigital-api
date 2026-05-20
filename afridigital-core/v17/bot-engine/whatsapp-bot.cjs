const bus = require("../spi../../afridigital-core/kernel/event-bus");
const EVENTS = require("../contracts/events");

function receiveMessage(user, message) {
  bus.publish(EVENTS.WHATSAPP_MESSAGE, { user, message });
}

module.exports = { receiveMessage };
