const bus = require("../core/context.cjs");
const EVENTS = require("../../afridigital-core/kern../../afridigital-core/kernel/events/registry.cjs");

function onMessage(msg) {
  bus.emit(EVENTS.MESSAGE_RECEIVED, msg);

  const response = {
    text: "Auto-response V12 active",
    to: msg.from
  };

  bus.emit(EVENTS.RESPONSE_GENERATED, response);
  return response;
}

module.exports = { onMessage };
