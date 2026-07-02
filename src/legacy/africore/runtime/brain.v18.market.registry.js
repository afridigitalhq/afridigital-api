const Redis = require("redis");

const client = Redis.createClient({ url: process.env.REDIS_URL });
client.connect().catch(console.error);

/**
 * Register external bots / businesses in ecosystem
 */
async function registerNode(nodeId, capabilities = []) {
  await client.hSet("afri:market:nodes", nodeId, JSON.stringify(capabilities));
}

async function listNodes() {
  const nodes = await client.hGetAll("afri:market:nodes");
  return Object.entries(nodes).map(([k, v]) => ({
    node: k,
    capabilities: JSON.parse(v)
  }));
}

module.exports = { registerNode, listNodes };
