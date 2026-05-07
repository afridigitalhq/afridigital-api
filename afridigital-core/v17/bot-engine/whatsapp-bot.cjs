const bus = require("../spine/event-bus");
const EVENTS = require("../contracts/events");

function receiveMessage(user, message) {
  bus.publish(EVENTS.WHATSAPP_MESSAGE, { user, message });
}

module.exports = { receiveMessage };
