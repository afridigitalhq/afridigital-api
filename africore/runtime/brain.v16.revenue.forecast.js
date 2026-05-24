const Redis = require("redis");

const client = Redis.createClient({ url: process.env.REDIS_URL });
client.connect().catch(console.error);

/**
 * Simple predictive scoring model (no external ML dependency)
 */
function predictRevenue(userEvents = []) {

  let score = 0;

  for (const e of userEvents) {
    if (e.includes("buy")) score += 0.6;
    if (e.includes("price")) score += 0.4;
    if (e.includes("upgrade")) score += 0.7;
    if (e.includes("demo")) score += 0.3;
  }

  return Math.min(1, score);
}

async function logForecast(user, score) {
  await client.xAdd("afri:forecast:revenue", "*", {
    user,
    score: score.toString()
  });
}

module.exports = { predictRevenue, logForecast };
