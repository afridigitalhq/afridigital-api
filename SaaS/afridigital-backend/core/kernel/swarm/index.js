const redis = require("../cluster/redis");

/**
 * Register agent in swarm
 */
async function joinSwarm(agent) {
  await redis.setNodeState(agent.id, {
    role: "agent",
    capabilities: agent.capabilities,
    lastSeen: Date.now()
  });

  await redis.publish("swarm:join", agent);
}

/**
 * Broadcast task to swarm
 */
async function broadcastTask(task) {
  await redis.publish("swarm:task", task);
}

module.exports = {
  joinSwarm,
  broadcastTask
};
