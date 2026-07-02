const bus = require("../spi../../afridigital-core/kern../../afridigital-core/kernel/events");
const EVENTS = require("../contracts/events");

function receiveMessage(user, message) {
  bus.publish(EVENTS.WHATSAPP_MESSAGE, { user, message });
}

module.exports = { receiveMessage };
