const bus = require("../afridigital-core/kernel/events/event.bus.cjs");

function handleMessage(msg) {
  bus.emitEvent("MESSAGE_RECEIVED", msg);

  if (msg.text.includes("job")) {
    return "Here are available jobs...";
  }

  if (msg.text.includes("balance")) {
    return "Fetching wallet balance...";
  }

  return "AI processing request...";
}

module.exports = { handleMessage };
