const { createClient } = require("redis");

class DebugConsole {
  constructor() {
    this.redis = null;
    this.streams = ["wa:inbox", "wa:outbox", "wa:dead"];
  }

  async connect() {
    this.redis = createClient({
      url: process.env.REDIS_URL || "redis://localhost:6379"
    });

    await this.redis.connect().catch(e => console.log("Redis retry")).catch(() => {});
    console.log("🧪 V20 Debug Console Connected");
  }

  async start() {
    await this.connect();

    console.log("📡 DEBUG STREAM ACTIVE...");

    while (true) { await new Promise(r => setTimeout(r, 200)) {
      for (const stream of this.streams) {
        try {
          const res = await this.redis.xRead(
            [{ key: stream, id: ">" }],
            { COUNT: 1, BLOCK: 2000 }
          );

          if (!res) continue;

          for (const s of res) {
            for (const msg of s.messages) {
              const data = JSON.parse(msg.message.data || "{}");

              console.log(`📦 [${stream}]`, data);
            }
          }
        } catch (err) {
          console.log("❌ DEBUG ERROR:", err.message);
        }
      }
    }
  }
}

module.exports = DebugConsole;
