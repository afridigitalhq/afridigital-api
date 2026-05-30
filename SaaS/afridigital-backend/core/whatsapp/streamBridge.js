const bus = require("../events/bus");
const redis = require("../redis/client");
const { sendWhatsAppMessage } = require("./gateway");

const CHANNEL = "afriai:tokens";
const buffers = new Map();
const FLUSH_MS = 800;

/**
 * SAFE REDIS CHECK
 */
function getSub() {
  try {
    if (!redis) return null;
    if (typeof redis.duplicate === "function") return redis.duplicate();
    return redis;
  } catch (e) {
    return null;
  }
}

function scheduleFlush(user) {
  const data = buffers.get(user);
  if (!data || data.timer) return;

  data.timer = setTimeout(async () => {
    const text = (data.buffer || []).join("");

    if (text.trim()) {
      await sendWhatsAppMessage(user, text);
    }

    buffers.delete(user);
  }, FLUSH_MS);
}

function startWhatsAppStreamBridge() {
  const sub = getSub();

  if (!sub || typeof sub.on !== "function") {
    console.log("⚠️ StreamBridge OFFLINE MODE (no Redis-compatible client)");
    return;
  }

  try {
    if (typeof sub.subscribe === "function") {
      sub.subscribe(CHANNEL);
    }
  } catch (e) {}

  sub.on("message", async (_, msg) => {
    try {
      const { sessionId, token } = JSON.parse(msg);

      if (!buffers.has(sessionId)) {
        buffers.set(sessionId, { buffer: [], timer: null });
      }

      const entry = buffers.get(sessionId);
      entry.buffer.push(token);

      scheduleFlush(sessionId);
    } catch (e) {
      console.log("⚠️ stream parse error:", e.message);
    }
  });

  console.log("📡 WhatsApp Stream Bridge ACTIVE");
}

module.exports = { startWhatsAppStreamBridge };
