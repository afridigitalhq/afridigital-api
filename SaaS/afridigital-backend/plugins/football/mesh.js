const redis = require("../../core/kernel/cluster/redis");
const ws = require("../../core/kernel/realtime/ws");

/**
 * Multi-region fanout
 */
async function broadcastMatch(event) {
  const payload = {
    type: "football",
    region: process.env.REGION || "default",
    event,
    ts: Date.now()
  };

  // cluster sync
  await redis.publish("football:mesh", payload);

  // UI sync
  ws.broadcast("football:mesh", payload);

  return payload;
}

module.exports = {
  broadcastMatch
};
