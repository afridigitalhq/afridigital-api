const bus = require("../../core/eventBus");

let streamBuffer = [];

bus.on("POLICY_DECISION", (data) => {
  streamBuffer.push({ type: "POLICY", data });
});

bus.on("ECONOMY_OPTIMIZATION", (data) => {
  streamBuffer.push({ type: "ECONOMY", data });
});

bus.on("MARKETPLACE_UPDATED", (data) => {
  streamBuffer.push({ type: "MARKET", data });
});

function getStream() {
  return streamBuffer.slice(-100);
}

module.exports = { getStream };
