const Redis = require("ioredis");
const kernel = require("../runtime/kernel");

const redis = new Redis(process.env.REDIS_URL);

const STREAM = "whatsapp:stream";
const GROUP = "afri-workers";
const CONSUMER = `worker-${Math.random().toString(16).slice(2)}`;

async function init() {
  try {
    await redis.xgroup("CREATE", STREAM, GROUP, "0", "MKSTREAM");
  } catch (e) {}
}

async function loop() {
  await init();

  while (true) {
    const res = await redis.xreadgroup(
      "GROUP",
      GROUP,
      CONSUMER,
      "BLOCK",
      5000,
      "COUNT",
      10,
      "STREAMS",
      STREAM,
      ">"
    );

    if (!res) continue;

    for (const [, messages] of res) {
      for (const [id, fields] of messages) {
        try {
          const raw = fields[fields.indexOf("payload") + 1];
          const event = JSON.parse(raw);

          await kernel.run(event);

          await redis.xack(STREAM, GROUP, id);
        } catch (e) {
          console.log("Mesh worker error:", e.message);
        }
      }
    }
  }
}

loop();
