const { publish } = require("../../core/kernel/cluster/redis");
const { broadcast } = require("../../core/kernel/realtime/ws");

/**
 * Live football event fanout
 */
async function streamFootballEvent(event) {
  const payload = {
    type: "football",
    event,
    ts: Date.now()
  };

  // cluster sync
  await publish("football:event", payload);

  // UI streaming
  broadcast("football:event", payload);

  return payload;
}

module.exports = {
  streamFootballEvent
};
