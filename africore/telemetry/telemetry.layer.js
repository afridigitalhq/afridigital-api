const Redis = require("redis");

const client = Redis.createClient({
  url: process.env.REDIS_URL || "redis://127.0.0.1:6379"
});

client.connect()
  .then(() => console.log("📡 Telemetry Layer ACTIVE"))
  .catch(e => console.log("📡 Telemetry Redis offline:", e.message));

async function emit(type, payload = {}) {

  try {

    await client.xAdd(
      "afri:telemetry:stream",
      "*",
      {
        type,
        payload: JSON.stringify(payload),
        ts: Date.now().toString()
      }
    );

  } catch (e) {

    console.log("TELEMETRY EMIT ERROR:", e.message);

  }

}

module.exports = { emit };
