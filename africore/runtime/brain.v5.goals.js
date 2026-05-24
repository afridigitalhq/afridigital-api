const Redis = require("redis");

const client = Redis.createClient({ url: process.env.REDIS_URL });
client.connect().catch(console.error);

const KEY = "afri:brain:goals";

const defaultGoals = [
  { id: "g1", name: "reduce_fraud", weight: 0.4 },
  { id: "g2", name: "increase_sales", weight: 0.3 },
  { id: "g3", name: "improve_latency", weight: 0.3 }
];

async function initGoals() {
  const exists = await client.exists(KEY);
  if (!exists) {
    await client.set(KEY, JSON.stringify(defaultGoals));
  }
}

async function getGoals() {
  const raw = await client.get(KEY);
  return JSON.parse(raw || "[]");
}

module.exports = { initGoals, getGoals };
