#!/data/data/com.termux/files/usr/bin/bash

FILE="./afridigital-core/kernel/v20/whatsapp-mesh.cjs"
mkdir -p "$(dirname "$FILE")"

cat > "$FILE" << 'JS'
const { createClient } = require("redis");

class WhatsAppMesh {
  constructor(fraudEngine) {
    this.fraud = fraudEngine;
    this.redis = null;

    this.streamIn = "wa:inbox";
    this.streamOut = "wa:outbox";
    this.streamDead = "wa:dead";

    this.workers = [];
  }

  async connect() {
    this.redis = createClient({
      url: process.env.REDIS_URL || "redis://localhost:6379"
    });

    await this.redis.connect().catch(() => {});
    console.log("📡 Redis Mesh Connected");
  }

  async ingest(message) {
    const payload = {
      ...message,
      ts: Date.now()
    };

    await this.redis.xAdd(this.streamIn, "*", {
      data: JSON.stringify(payload)
    });

    return { queued: true };
  }

  async startWorker(workerId = "worker-1") {
    console.log("⚙️ Worker started:", workerId);

    while (true) {
      try {
        const res = await this.redis.xRead(
          [{ key: this.streamIn, id: ">" }],
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

            const out = {
              user: data.user,
              text: data.text,
              action: result.action,
              score: result.score,
              ts: Date.now()
            };

            await this.redis.xAdd(this.streamOut, "*", {
              data: JSON.stringify(out)
            });

            console.log("📥 Processed:", out);
          }
        }
      } catch (err) {
        console.log("❌ Worker error:", err.message);

        await this.redis.xAdd(this.streamDead, "*", {
          error: err.message
        });
      }
    }
  }

  async startSender(senderFn) {
    console.log("📤 Sender worker active");

    while (true) {
      const res = await this.redis.xRead(
        [{ key: this.streamOut, id: ">" }],
        { COUNT: 1, BLOCK: 5000 }
      );

      if (!res) continue;

      for (const stream of res) {
        for (const msg of stream.messages) {
          const data = JSON.parse(msg.message.data);

          try {
            await senderFn(data);
            console.log("✅ SENT:", data);
          } catch (e) {
            console.log("❌ SEND FAIL:", e.message);

            await this.redis.xAdd(this.streamDead, "*", {
              error: e.message,
              data: JSON.stringify(data)
            });
          }
        }
      }
    }
  }
}

module.exports = WhatsAppMesh;
JS

echo "🧠 V20 MESH SYSTEM DEPLOYED"
