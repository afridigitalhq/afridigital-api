const redis = require("../../runtime/redis");
const kernel = require("../../runtime/kernel");

const STREAM = "whatsapp:stream";
const GROUP = "workers:v2";

const DLQ = "whatsapp:dlq";
const RETRY = "whatsapp:retry";
const PRIORITY = "whatsapp:priority";

async function ensureGroups() {
  try { await redis.xgroup("CREATE", STREAM, GROUP, "0", "MKSTREAM"); } catch {}
  try { await redis.xgroup("CREATE", DLQ, "dlq-group", "0", "MKSTREAM"); } catch {}
  try { await redis.xgroup("CREATE", RETRY, "retry-group", "0", "MKSTREAM"); } catch {}
}

function routeLane(fields) {
  const payloadIndex = fields.indexOf("payload");
  const payload = JSON.parse(fields[payloadIndex + 1] || "{}");

  if (payload.priority === "high") return PRIORITY;
  if (payload.retry) return RETRY;
  return STREAM;
}

async function processEvent(id, fields) {
  const payloadIndex = fields.indexOf("payload");
  const payload = JSON.parse(fields[payloadIndex + 1] || "{}");

  try {
    await kernel.run(payload);
    await redis.xack(STREAM, GROUP, id);
  } catch (e) {

    const retryCount = (payload.retryCount || 0) + 1;

    if (retryCount > 5) {
      await redis.xadd(DLQ, "*",
        "payload", JSON.stringify({
          ...payload,
          error: e.message,
          failedAt: Date.now()
        })
      );
      return;
    }

    const delay = Math.min(30000, 1000 * retryCount * 2);

    setTimeout(async () => {
      await redis.xadd(RETRY, "*",
        "payload", JSON.stringify({
          ...payload,
          retry: true,
          retryCount
        })
      );
    }, delay);
  }
}

async function loop() {
  await ensureGroups();

  console.log("⚡ Event Mesh v2.1 ONLINE");

  while (true) {
    try {
      const resp = await redis.xreadgroup(
        "GROUP",
        GROUP,
        "worker-1",
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
          await processEvent(id, fields);
        }
      }

    } catch (e) {
      console.log("🧨 Mesh loop recovery:", e.message);
      await new Promise(r => setTimeout(r, 1000));
    }
  }
}

loop();
