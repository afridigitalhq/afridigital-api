async function initRedisStreams(redis) {
  const streams = [
    { key: "wa:inbox", group: "workers" },
    { key: "wa:outbox", group: "senders" }
  ];

  for (const s of streams) {
    try {
      await redis.xGroupCreate(
        s.key,
        s.group,
        "$",
        { MKSTREAM: true }
      );
      console.log(`🟢 Stream ready: ${s.key}`);
    } catch (e) {
      if (!String(e.message).includes("BUSYGROUP")) {
        console.log(`❌ Stream init error (${s.key}):`, e.message);
      }
    }
  }
}

module.exports = { initRedisStreams };
