const Redis = require("redis");

const client = Redis.createClient({ url: process.env.REDIS_URL });
client.connect().catch(console.error);

async function logBusinessEvent(event) {
  await client.xAdd("afri:business:audit", "*", {
    event: JSON.stringify(event),
    ts: Date.now().toString()
  });
}

module.exports = { logBusinessEvent };
