const Redis = require("redis");

const client = Redis.createClient({ url: process.env.REDIS_URL });

client.connect().catch(console.error);

const TTL = 60 * 60 * 24; // 24h memory window

async function pushMessage(user, message) {
  const key = `chat:${user}`;

  await client.rPush(key, JSON.stringify({
    text: message.text,
    from: message.from,
    ts: Date.now()
  }));

  await client.expire(key, TTL);
}

async function getContext(user, limit = 10) {
  const key = `chat:${user}`;

  const messages = await client.lRange(key, -limit, -1);

  return messages.map(m => JSON.parse(m));
}

module.exports = {
  pushMessage,
  getContext
};
