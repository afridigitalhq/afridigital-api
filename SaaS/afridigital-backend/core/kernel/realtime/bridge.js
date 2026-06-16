const redis = require("../cluster/redis");
const ws = require("./ws");

/**
 * Central DAG event emitter
 */
async function emit(event, payload) {
  // Redis pub/sub (cluster sync)
  await redis.publish(event, payload);

  // WebSocket live stream
  ws.broadcast(event, payload);
}

module.exports = {
  emit
};
