const redis = require("../redis/client");

function getSub() {
  try {
    if (!redis) return null;
    if (typeof redis.duplicate === "function") return redis.duplicate();
    return redis;
  } catch (e) {
    return null;
  }
}

function startTypingBridge() {
  const sub = getSub();

  if (!sub || typeof sub.subscribe !== "function") {
    console.log("⚠️ TypingBridge OFFLINE MODE");
    return;
  }

  console.log("⌨️ TypingBridge ACTIVE");

  try {
    sub.subscribe?.("typing:events");
  } catch (e) {
    console.log("⚠️ typing subscribe skipped:", e.message);
  }
}

module.exports = { startTypingBridge };
