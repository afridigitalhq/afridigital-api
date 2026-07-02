const Redis = require("redis");

const client = Redis.createClient({ url: process.env.REDIS_URL });
client.connect().catch(console.error);

async function credit(agent, value) {
  await client.zIncrBy("afri:agents:wallets", value, agent);
}

async function rankAgents() {
  return await client.zRange("afri:agents:wallets", 0, -1, { REV: true });
}

module.exports = { credit, rankAgents };
