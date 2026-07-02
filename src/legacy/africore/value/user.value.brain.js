const Redis = require("redis");

const client = Redis.createClient({ url: process.env.REDIS_URL });
client.connect().catch(console.error);

function scoreIntent(text) {
  let score = 0;

  if (text.includes("buy")) score += 0.5;
  if (text.includes("price")) score += 0.3;
  if (text.includes("upgrade")) score += 0.6;
  if (text.includes("help")) score += 0.2;

  return Math.min(1, score);
}

async function updateUserValue(user, intentScore) {
  const key = `user:value:${user}`;

  const current = await client.hGetAll(key);

  const value = {
    score: intentScore,
    lastSeen: Date.now().toString(),
    tier:
      intentScore > 0.7 ? "hot" :
      intentScore > 0.4 ? "warm" : "cold"
  };

  await client.hSet(key, value);

  await client.xAdd("afri:user:value:stream", "*", {
    user,
    score: intentScore.toString(),
    tier: value.tier
  });

  return value;
}

module.exports = { scoreIntent, updateUserValue };
