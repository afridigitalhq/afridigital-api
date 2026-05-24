const Redis = require("redis");
const client = Redis.createClient({ url: process.env.REDIS_URL });

client.connect().catch(console.error);

async function isProcessed(id) {
  const key = `afri:live:processed:${id}`;
  const exists = await client.get(key);

  if (exists) return true;

  await client.set(key, "1", { EX: 30 });
  return false;
}

module.exports = { isProcessed };
