const Redis = require("ioredis");
const kernel = require("../runtime/kernel");

const redis = new (require("../redis/disabledClient"))();

const STREAM = "whatsapp:stream";
const GROUP = "whatsapp-group";
const CONSUMER = "worker-1";

async function init() {
  try {
    await redis.xgroup("CREATE", STREAM, GROUP, "$", "MKSTREAM");
  } catch (e) {}
}

async function loop() {
  await init();

  while (true) {
    const resp = await redis.xreadgroup(
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

    if (!resp) continue;

    for (const [, messages] of resp) {
      for (const [id, fields] of messages) {
        try {
          const event = JSON.parse(fields[1]);
          await kernel.run(event);
          await redis.xack(STREAM, GROUP, id);
        } catch (err) {
          console.log("Mesh error:", err.message);
        }
      }
    }
  }
}

loop();
