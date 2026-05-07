const { emit } = require("../events/event.bus.cjs");

console.log("📡 MULTI-MESSAGING ENGINE ONLINE");

function onMessage(msg) {
  emit("MESSAGE_RECEIVED", msg);

  if (msg.text.includes("job")) {
    emit("JOB_QUERY", msg);
  }
}

module.exports = { onMessage };
