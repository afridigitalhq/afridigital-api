const { createClient } = require("redis");

class WhatsAppMesh {
  constructor(fraudEngine) {
    this.fraud = fraudEngine;
    this.redis = null;

    this.stream = "wa:inbox";
    this.group = "wa-group";
    this.consumer = "worker-1";

    this.out = "wa:outbox";
    this.dead = "wa:dead";
  }

  async connect() {
    this.redis = createClient({ url: process.env.REDIS_URL || "redis://localhost:6379" });
    await this.redis.connect().catch(() => {});
const { ensureStreams } = require("./redis.stream.guard.cjs"); await ensureStreams(this.redis);
    console.log("📡 Mesh Connected");
  }

  async startWorker() {
    console.log("⚙️ Consumer Worker Running");

    while (true) {
      try {
        const res = await this.redis.xReadGroup(
          this.group,
          this.consumer,
          [{ key: this.stream, id: "$"}],
          { COUNT: 1, BLOCK: 5000 }
        );

        if (!res) continue;

        for (const stream of res) {
          for (const msg of stream.messages) {

            const data = JSON.parse(msg.message.data);

            const result = await this.fraud.analyze({
              event: data.text || "MESSAGE",
              payload: { user: data.user }
            });

            await this.redis.xAdd(this.out, "*", {
              data: JSON.stringify({
                user: data.user,
                text: data.text,
                action: result.action,
                score: result.score,
                ts: Date.now()
              })
            });

            await this.redis.xAck(this.stream, this.group, msg.id);

            console.log("📥 PROCESSED + ACKED:", msg.id);
          }
        }

      } catch (err) {
        console.log("❌ Worker error:", err.message);
      }
    }
  }
}

module.exports = WhatsAppMesh;
