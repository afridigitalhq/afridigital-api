const Redis = require("redis");

const client = Redis.createClient({
  url: process.env.REDIS_URL
});

client.connect().catch(console.error);

const PREFIX = "afri:memory:";

/**
 * Store a message in user memory
 */
async function push(userId, message) {
  const key = PREFIX + userId;

  await client.lPush(key, JSON.stringify({
    message,
    ts: Date.now()
  }));

  // keep last 50 messages only
  await client.lTrim(key, 0, 49);
}

/**
 * Get recent memory
 */
async function recall(userId) {
  const key = PREFIX + userId;
  const data = await client.lRange(key, 0, 49);

  return data.map(d => JSON.parse(d)).reverse();
}

/**
 * Clear memory (admin use)
 */
async function clear(userId) {
  await client.del(PREFIX + userId);
}

module.exports = { push, recall, clear };
