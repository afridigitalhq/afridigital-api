const { createClient } = require("redis");

class ReplayEngine {
  constructor() {
    this.redis = null;
    this.streamIn = "wa:inbox";
    this.streamOut = "wa:outbox";
  }

  async connect() {
    this.redis = createClient({
      url: process.env.REDIS_URL || "redis://localhost:6379"
    });

    await this.redis.connect().catch(e => console.log("Redis retry")).catch(() => {});
    console.log("♻️ V20 Replay Engine Connected");
  }

  async replay(stream = this.streamIn, limit = 10) {
    const res = await this.redis.xRange(stream, "-", "+");

    const slice = res.slice(-limit);

    for (const msg of slice) {
      const data = JSON.parse(msg.message.data || "{}");

      console.log("🔁 REPLAY:", data);

      await this.redis.xAdd(this.streamOut, "*", {
        data: JSON.stringify({
          ...data,
          replay: true,
          ts: Date.now()
        })
      });
    }

    return { replayed: slice.length };
  }
}

module.exports = ReplayEngine;
