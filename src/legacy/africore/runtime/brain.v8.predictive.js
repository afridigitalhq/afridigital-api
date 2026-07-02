const Redis = require("redis");

const client = Redis.createClient({ url: process.env.REDIS_URL });
client.connect().catch(console.error);

// lightweight intent model (no external ML dependency)
function predictIntent(msg) {
  const text = msg.text.toLowerCase();

  let score = 0;

  if (text.includes("price")) score += 0.3;
  if (text.includes("buy")) score += 0.5;
  if (text.includes("subscribe")) score += 0.6;
  if (text.includes("upgrade")) score += 0.7;
  if (text.includes("how")) score += 0.2;
  if (text.includes("demo")) score += 0.4;

  return Math.min(1, score);
}

async function logPrediction(user, score) {
  await client.xAdd("afri:brain:v8:predictions", "*", {
    user,
    score: score.toString()
  });
}

module.exports = { predictIntent, logPrediction };
