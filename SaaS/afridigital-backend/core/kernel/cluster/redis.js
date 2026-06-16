const Redis = require("redis");

const client = Redis.createClient({
  url: process.env.REDIS_URL
});

client.connect();

/**
 * Store node state
 */
async function setNodeState(nodeId, state) {
  await client.hSet("cluster:nodes", nodeId, JSON.stringify(state));
}

/**
 * Get full cluster state
 */
async function getClusterState() {
  const raw = await client.hGetAll("cluster:nodes");

  const parsed = {};
  for (const k in raw) {
    parsed[k] = JSON.parse(raw[k]);
  }

  return parsed;
}

/**
 * Publish DAG events (real-time coordination)
 */
async function publish(event, payload) {
  await client.publish("dag:events", JSON.stringify({
    event,
    payload,
    ts: Date.now()
  }));
}

module.exports = {
  setNodeState,
  getClusterState,
  publish
};
