const Redis = require("redis");

const client = Redis.createClient({ url: process.env.REDIS_URL });
client.connect().catch(console.error);

const REGION = process.env.AFRI_REGION || "lagos";

/**
 * Write memory across federated regions
 */
async function writeFederatedMemory(user, data) {
  const payload = {
    region: REGION,
    user,
    data: JSON.stringify(data),
    ts: Date.now()
  };

  await client.xAdd("afri:federation:memory", "*", payload);
}

/**
 * Read global memory snapshot (simplified view)
 */
async function readGlobalMemory(user) {
  const entries = await client.xRange("afri:federation:memory", "-", "+");

  return entries
    .map(e => JSON.parse(e.message.data))
    .filter(m => m.user === user);
}

module.exports = { writeFederatedMemory, readGlobalMemory };
