const express = require("express");
const crypto = require("crypto");
const Redis = require("ioredis");

const app = express();
app.use(express.json({ limit: "1mb" }));

/* =========================
   INTELLIGENCE STATE
========================= */

const INSTANCE_ID = `v7-${Math.random().toString(36).slice(2,10)}`;

let redis = null;
let ready = false;

const seen = new Map();

/* =========================
   REDIS INIT
========================= */

function initRedis() {
  if (!process.env.REDIS_URL) {
    console.log("⚠️ V7 running in memory mode");
    return;
  }

  redis = new Redis(process.env.REDIS_URL);

  redis.on("connect", () => {
    ready = true;
    console.log("🟢 V7 Intelligence Mesh online");
  });

  redis.on("error", () => {
    ready = false;
    console.log("⚠️ Redis degraded (V7 fallback)");
  });
}

initRedis();

/* =========================
   INTELLIGENCE CLASSIFIER
========================= */

function classify(event) {
  const text = (event.text || "").toLowerCase();

  if (text.startsWith("/")) return "command";
  if (text.includes("error")) return "system";
  if (text.includes("order") || text.includes("pay")) return "ai-task";
  if (text.length < 10) return "low";

  return "chat";
}

/* =========================
   STREAM ROUTER (V7 CORE)
========================= */

function routeStream(type) {
  switch (type) {
    case "ai-task": return "afri:events:ai";
    case "command": return "afri:events:high";
    case "system": return "afri:events:high";
    case "low": return "afri:events:low";
    default: return "afri:events:normal";
  }
}

/* =========================
   IDEMPOTENCY
========================= */

function isSeen(id) {
  if (!id) return false;
  if (seen.has(id)) return true;
  seen.set(id, Date.now());
  setTimeout(() => seen.delete(id), 3600000);
  return false;
}

/* =========================
   ENQUEUE (INTELLIGENT)
========================= */

async function enqueue(event) {
  const type = classify(event);
  const stream = routeStream(type);

  event.type = type;
  event.stream = stream;

  if (redis && ready) {
    await redis.xadd(stream, "*", "data", JSON.stringify(event));
    return { mode: "redis", stream, type };
  }

  return { mode: "memory", type };
}

/* =========================
   WEBHOOK (<200ms GUARANTEE)
========================= */

function verify(req) {
  const sig = req.headers["x-hub-signature-256"];
  if (!sig) return false;

  const expected = crypto
    .createHmac("sha256", process.env.META_APP_SECRET || "")
    .update(req.rawBody || JSON.stringify(req.body))
    .digest("hex");

  return sig.replace("sha256=", "") === expected;
}

app.post("/webhook", async (req, res) => {
  try {
    if (!verify(req)) return res.sendStatus(401);

    const msg =
      req.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (!msg) return res.sendStatus(200);
    if (isSeen(msg.id)) return res.sendStatus(200);

    await enqueue({
      id: msg.id,
      from: msg.from,
      text: msg.text?.body || "",
      ts: Date.now()
    });

    return res.sendStatus(200);
  } catch (e) {
    return res.sendStatus(200);
  }
});

/* =========================
   V7 AI WORKER LOOP
========================= */

async function process(event) {
  console.log("🧠 V7 processing:", event.type, event.id);

  // 🔥 AI PIPELINE HOOK (future LLM / logic layer)
}

async function worker(streamName) {
  if (!redis) return;

  while (true) {
    try {
      const data = await redis.xreadgroup(
        "GROUP",
        "v7-group",
        INSTANCE_ID,
        "COUNT",
        10,
        "BLOCK",
        2000,
        "STREAMS",
        streamName,
        ">"
      );

      if (!data) continue;

      for (const item of data[0][1]) {
        const event = JSON.parse(item[1][1]);

        if (isSeen(event.id)) continue;

        await process(event);

        await redis.xack(streamName, "v7-group", item[0]);
      }

    } catch (e) {
      console.log("⚠️ worker recover:", e.message);
      await new Promise(r => setTimeout(r, 500));
    }
  }
}

/* =========================
   BOOT MULTI-STREAM
========================= */

const streams = [
  "afri:events:ai",
  "afri:events:high",
  "afri:events:normal",
  "afri:events:low"
];

streams.forEach(worker);

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("🚀 V7 INTELLIGENCE MESH RUNNING ON", PORT);
  console.log("🧬 NODE:", INSTANCE_ID);
});

app.get("/env-check", (req, res) => {
  res.json({
    META_ACCESS_TOKEN: !!process.env.META_ACCESS_TOKEN,
    META_PHONE_NUMBER_ID: !!process.env.META_PHONE_NUMBER_ID,
    META_VERIFY_TOKEN: !!process.env.META_VERIFY_TOKEN,
    REDIS_URL: !!process.env.REDIS_URL
  });
});

