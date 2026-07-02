const Redis = require("redis");

const client = Redis.createClient({ url: process.env.REDIS_URL });
client.connect().catch(console.error);

async function saveMemory(user, data) {
  await client.hSet(`afri:memory:${user}`, {
    last: JSON.stringify(data),
    ts: Date.now().toString()
  });
}

async function getMemory(user) {
  const data = await client.hGetAll(`afri:memory:${user}`);
  return data;
}

module.exports = { saveMemory, getMemory };
