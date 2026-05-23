const { STREAMS } = require("./stream.core.cjs");

async function initRedisStreams(redis) {
  for (const key of Object.values(STREAMS)) {
    if (!key.startsWith("wa:")) continue;

    try {
      await redis.xGroupCreate(key, STREAMS.GROUP, "$", { MKSTREAM: true });
    } catch (err) {
      if (!String(err.message).includes("BUSYGROUP")) {
        console.log("Stream init error:", key, err.message);
      }
    }
  }

  console.log("🟢 AfriAI Streams Hardened");
}

module.exports = { initRedisStreams };
