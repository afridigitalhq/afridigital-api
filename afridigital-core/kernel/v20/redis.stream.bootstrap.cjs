async function initRedisStreams(redis) {
  try {
    await redis.xGroupCreate(
      "wa:inbox",
      "workers",
      "$",
      { MKSTREAM: true }
    );
    console.log("🟢 Redis stream wa:inbox initialized");
  } catch (e) {
    if (!String(e.message).includes("BUSYGROUP")) {
      console.log("❌ Redis stream init error:", e.message);
    }
  }
}

module.exports = { initRedisStreams };
