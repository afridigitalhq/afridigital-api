const Redis = require("redis");

const client = Redis.createClient({ url: process.env.REDIS_URL });
client.connect().catch(console.error);

async function logEvent(type, payload) {
  await client.xAdd("afri:brain:logs", "*", {
    type,
    data: JSON.stringify(payload)
  });
}

function assertSafe(action) {
  const banned = ["eval", "exec", "writeFileSync", "child_process"];

  if (banned.some(b => JSON.stringify(action).includes(b))) {
    throw new Error("🚫 Unsafe cognitive operation blocked");
  }
}

module.exports = { logEvent, assertSafe };
