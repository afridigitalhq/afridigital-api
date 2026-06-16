const redis = require("../cluster/redis");

const KEY = "agent:memory";

/**
 * Append shared memory across cluster
 */
async function push(event) {
  await redis.setNodeState("memory", event);
}

/**
 * Retrieve shared memory
 */
async function get() {
  const state = await redis.getClusterState();
  return state.memory || null;
}

module.exports = {
  push,
  get
};
