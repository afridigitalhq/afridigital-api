const Redis = require("ioredis");

const redis = new Redis(process.env.REDIS_URL);

const STREAM = "afridigital:event:stream";

async function emit(event, payload) {
  await redis.xadd(STREAM, "*",
    "event", event,
    "payload", JSON.stringify(payload)
  );

  console.log("📡 STREAM EVENT:", event);
}

async function consume(callback) {
  let lastId = "0-0";

  while (true) {
    const data = await redis.xread(
      "BLOCK", 5000,
      "STREAMS",
      STREAM,
      lastId
    );

    if (!data) continue;

    const [_, messages] = data[0];

    for (const msg of messages) {
      const [id, fields] = msg;
      lastId = id;

      const event = fields[1];
      const payload = JSON.parse(fields[3]);

      callback(event, payload);
    }
  }
}

module.exports = { emit, consume };
