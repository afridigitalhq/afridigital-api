const Redis = require("redis");

const client = Redis.createClient({ url: process.env.REDIS_URL });
client.connect().catch(console.error);

async function saveMemory(user, message, meta = {}) {
  const key = `afri:memory:user:${user}`;

  const record = {
    message,
    meta,
    ts: Date.now()
  };

  await client.rPush(key, JSON.stringify(record));
  await client.lTrim(key, -50, -1); // keep last 50 messages
}

async function getMemory(user) {
  const key = `afri:memory:user:${user}`;
  const data = await client.lRange(key, 0, -1);
  return data.map(JSON.parse);
}

module.exports = { saveMemory, getMemory };
