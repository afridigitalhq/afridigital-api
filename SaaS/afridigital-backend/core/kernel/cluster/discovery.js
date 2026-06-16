const redis = require("./redis");
const { getNodeInfo } = require("./node");

const HEARTBEAT_KEY = "cluster:heartbeat";

/**
 * Announce node presence
 */
async function announce() {
  const node = getNodeInfo();

  await redis.setNodeState(node.id, {
    ...node,
    status: "online",
    lastSeen: Date.now()
  });

  await redis.publish("cluster:join", node);
}

/**
 * Heartbeat loop
 */
function startHeartbeat(interval = 5000) {
  setInterval(() => {
    announce();
  }, interval);
}

module.exports = {
  announce,
  startHeartbeat
};
