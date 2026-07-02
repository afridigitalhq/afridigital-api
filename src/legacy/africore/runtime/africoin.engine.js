const Redis = require("redis");

const client = Redis.createClient({ url: process.env.REDIS_URL });
client.connect().catch(console.error);

async function credit(user, amount, reason = "interaction") {
  const key = `afri:coin:${user}`;
  const current = Number((await client.get(key)) || 0);

  const updated = current + amount;

  await client.set(key, updated.toString());

  await client.xAdd("afri:coin:ledger", "*", {
    user,
    amount: amount.toString(),
    reason
  });

  return updated;
}

async function balance(user) {
  return Number((await client.get(`afri:coin:${user}`)) || 0);
}

module.exports = { credit, balance };
