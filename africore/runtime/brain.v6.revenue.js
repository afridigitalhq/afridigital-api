const Redis = require("redis");

const client = Redis.createClient({ url: process.env.REDIS_URL });
client.connect().catch(console.error);

function scoreUser(msg) {
  let score = 0;

  if (msg.text.includes("price")) score += 0.4;
  if (msg.text.includes("buy")) score += 0.6;
  if (msg.text.includes("how much")) score += 0.3;

  return Math.min(1, score);
}

async function logConversion(user, score) {
  await client.xAdd("afri:revenue:events", "*", {
    user,
    score: score.toString()
  });
}

module.exports = { scoreUser, logConversion };
