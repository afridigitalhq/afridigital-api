const Redis = require("redis");

const client = Redis.createClient({ url: process.env.REDIS_URL });
client.connect().catch(console.error);

async function getUserValue(user) {
  const raw = await client.hGetAll(`afri:user:value:${user}`);

  return {
    score: Number(raw.score || 0),
    tier: raw.tier || "new",
    interactions: Number(raw.interactions || 0)
  };
}

async function updateUserValue(user, delta = 0.01) {
  const data = await getUserValue(user);

  const newScore = Math.min(1, data.score + delta);

  await client.hSet(`afri:user:value:${user}`, {
    score: newScore.toString(),
    tier: newScore > 0.7 ? "vip" : newScore > 0.4 ? "warm" : "new",
    interactions: (data.interactions + 1).toString()
  });

  return newScore;
}

module.exports = { getUserValue, updateUserValue };
