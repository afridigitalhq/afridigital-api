const Redis = require("redis");
const client = Redis.createClient({ url: process.env.REDIS_URL });

client.connect().catch(console.error);

const KEY = "afri:brain:rewards:";

async function score(user, data) {
  const payload = {
    ts: Date.now(),
    user,
    ...data
  };

  await client.lPush(KEY + user, JSON.stringify(payload));
}

async function getScore(user) {
  const items = await client.lRange(KEY + user, 0, 50);

  let score = 0;

  for (const i of items) {
    const d = JSON.parse(i);

    if (d.fraud === "low") score += 1;
    if (d.success) score += 2;
    if (d.latency < 1000) score += 1;
  }

  return score;
}

module.exports = { score, getScore };
