const Redis = require("redis");

const client = Redis.createClient({ url: process.env.REDIS_URL });
client.connect().catch(console.error);

async function credit(user, amount) {
  await client.hIncrBy(`africoin:${user}`, "balance", amount);
  await client.xAdd("africoin:ledger", "*", {
    type: "credit",
    user,
    amount: amount.toString()
  });
}

async function debit(user, amount) {
  await client.hIncrBy(`africoin:${user}`, "balance", -amount);
  await client.xAdd("africoin:ledger", "*", {
    type: "debit",
    user,
    amount: amount.toString()
  });
}

async function getBalance(user) {
  return await client.hGet(`africoin:${user}`, "balance");
}

module.exports = { credit, debit, getBalance };
