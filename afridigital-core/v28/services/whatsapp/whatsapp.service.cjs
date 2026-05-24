const { publish } = require("../../events/event.bus.cjs");

function receiveMessage(userId, message) {
  publish("CHAT_MESSAGE", { userId, message });

  publish("AI_RESPONSE_REQUESTED", { userId, message });
}

module.exports = { receiveMessage };
