const Redis = require("redis");

const client = Redis.createClient({ url: process.env.REDIS_URL });
client.connect().catch(console.error);

const PREFIX = "afri:memory:v1:";

// 🧠 Save interaction snapshot
async function recordInteraction(user, data) {
  const key = PREFIX + user;

  const prev = await client.hGetAll(key);

  const updated = {
    user,
    lastMessage: data.text || "",
    lastIntent: data.intent || "0",
    lastRoute: data.route || "UNKNOWN",
    updatedAt: Date.now().toString(),

    totalMessages: String((Number(prev.totalMessages || 0) + 1)),
    valueScore: String((Number(prev.valueScore || 0) + (data.valueDelta || 0)))
  };

  await client.hSet(key, updated);

  await client.xAdd("afri:memory:stream", "*", {
    user,
    data: JSON.stringify(updated)
  });
}

// 🧠 Retrieve memory
async function getMemory(user) {
  const data = await client.hGetAll(PREFIX + user);
  return {
    user,
    lastMessage: data.lastMessage || "",
    lastIntent: Number(data.lastIntent || 0),
    lastRoute: data.lastRoute || "UNKNOWN",
    totalMessages: Number(data.totalMessages || 0),
    valueScore: Number(data.valueScore || 0)
  };
}

module.exports = {
  recordInteraction,
  getMemory
};
