const crypto = require("crypto");
const redis = require("../runtime/redis"); // expected ioredis instance or adapter

const APP_SECRET = process.env.WHATSAPP_APP_SECRET || "dev_secret";
const STREAM = "whatsapp:stream";

function verifySignature(req) {
  const sig = req.headers["x-hub-signature-256"];
  const body = JSON.stringify(req.body || {});

  if (!sig) return { ok: false, reason: "missing_signature" };

  const expected =
    "sha256=" +
    crypto.createHmac("sha256", APP_SECRET).update(body).digest("hex");

  const valid = crypto.timingSafeEqual(
    Buffer.from(sig),
    Buffer.from(expected)
  );

  return { ok: valid };
}

async function isReplay(msgId) {
  if (!msgId) return true;
  const key = `dedup:${msgId}`;

  const exists = await redis.get(key);
  if (exists) return true;

  await redis.set(key, "1", "EX", 60 * 60 * 24); // 24h dedup window
  return false;
}

async function emit(event) {
  const userKey = event.from || "unknown";

  // deterministic ordering per user
  await redis.xadd(
    STREAM,
    "MAXLEN",
    "~",
    "100000",
    "*",
    "user",
    userKey,
    "type",
    event.type || "whatsapp.message",
    "payload",
    JSON.stringify(event)
  );
}

module.exports = {
  async validate(req) {
    const msg = req.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (!msg) return { ok: false, drop: true };

    const signature = verifySignature(req);
    if (!signature.ok) return { ok: false, reason: "bad_signature" };

    const replay = await isReplay(msg.id);
    if (replay) return { ok: false, reason: "replay" };

    const event = {
      id: msg.id,
      from: msg.from,
      text: msg.text?.body || "",
      ts: Date.now()
    };

    await emit(event);

    return { ok: true, event };
  }
};
