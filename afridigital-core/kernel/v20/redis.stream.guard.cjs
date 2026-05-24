async function ensureStreams(redis) {
  const streams = ["wa:inbox", "wa:outbox"];

  for (const key of streams) {
    try {
      await redis.xGroupCreate(key, "workers", "$", { MKSTREAM: true });
    } catch (e) {
      if (!String(e.message).includes("BUSYGROUP")) {
        console.log("Stream guard error:", key, e.message);
      }
    }
  }
}

module.exports = { ensureStreams };
