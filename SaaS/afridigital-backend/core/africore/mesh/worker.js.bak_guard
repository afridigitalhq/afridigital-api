const redis = require("../runtime/redis");
const kernel = require("../runtime/kernel");

const STREAM = "whatsapp:stream";
const GROUP = "workers";

async function init() {
  try {
    await redis.xgroup("CREATE", STREAM, GROUP, "0", "MKSTREAM");
  } catch (e) {}
}

async function loop() {
  await init();

  while (true) {
    const resp = await redis.xreadgroup(
      "GROUP",
      GROUP,
      "consumer-1",
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
          const payloadIndex = fields.indexOf("payload");
          const payload = JSON.parse(fields[payloadIndex + 1]);

          await kernel.run(payload);

          await redis.xack(STREAM, GROUP, id);
        } catch (e) {
          console.log("DLQ move:", e.message);
        }
      }
    }
  }
}

loop();
