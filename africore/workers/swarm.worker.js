const { createClient } = require("redis");

const WORKER_ID =
  process.env.WORKER_ID ||
  "worker-" + Math.random().toString(16).slice(2);

async function start() {
  console.log("🧬 Swarm Worker online:", WORKER_ID);

  const client = createClient({ url: process.env.REDIS_URL });

  client.on("error", (e) => {
    console.log("⚠️ Redis error:", e.message);
  });

  await client.connect();

  // ensure stream exists safely
  try {
    await client.xGroupCreate(
      "afri:memory:stream",
      "memory-group",
      "$",
      { MKSTREAM: true }
    );
    console.log("📡 Stream group ready");
  } catch (e) {
    console.log("ℹ️ Stream group already exists");
  }

  while (true) {
    try {
      const result = await client.xReadGroup(
        "memory-group",
        WORKER_ID,
        [
          {
            key: "afri:memory:stream",
            id: ">"
          }
        ],
        {
          COUNT: 5,
          BLOCK: 5000
        }
      );

      if (!result) continue;

      for (const stream of result) {
        for (const message of stream.messages) {
          console.log("📥", WORKER_ID, message.id);

          // ACK immediately (prevents duplicate processing)
          await client.xAck(
            "afri:memory:stream",
            "memory-group",
            message.id
          );
        }
      }
    } catch (err) {
      console.log("⚠️ loop error:", err.message);
      await new Promise(r => setTimeout(r, 2000));
    }
  }
}

start();
