const { createClient } = require("redis");
const https = require("https");
const { STREAMS } = require("./stream.core.cjs");
const { isDuplicate } = require("./message.dedup.cjs");

class WhatsAppSenderLoop {
  constructor() {
    this.redis = null;
    this.streamOut = STREAMS.OUTBOX;
    this.group = STREAMS.GROUP;
    this.consumer = `sender-${Math.random().toString(36).slice(2, 8)}`;
  }

  async connect() {
  await require("./afridigital-core/kernel/v20/redis.stream.bootstrap.cjs").initRedisStreams(this.redis);
    this.redis = createClient({
      url: process.env.REDIS_URL || "redis://localhost:6379"
    });

    await this.redis.connect().catch(() => {});
  await require("./afridigital-core/kernel/v20/redis.stream.bootstrap.cjs").initRedisStreams(this.redis);
    console.log("📤 Sender Loop Connected");
  }

  async sendWhatsApp(message) {
    const token = process.env.WHATSAPP_TOKEN;
    const phoneId = process.env.WHATSAPP_PHONE_ID;

    const dedupKey = {
      user: message.user,
      text: message.text || "msg",
      ts: message.ts || Date.now()
    };

    const dup = await isDuplicate(this.redis, dedupKey);
    if (dup) {
      console.log("🟡 Duplicate blocked:", message.user);
      return { skipped: true };
    }

    const payload = JSON.stringify({
      messaging_product: "whatsapp",
      to: message.user,
      type: "text",
      text: {
        body: `AI: ${message.text || "Processed"}`
      }
    });

    const options = {
      hostname: "graph.facebook.com",
      path: `/v19.0/${phoneId}/messages`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    };

    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let data = "";

        res.on("data", (chunk) => (data += chunk));

        res.on("end", async () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve({ success: true, data });
          } else {
            reject(new Error(data));
          }
        });
      });

      req.on("error", reject);
      req.write(payload);
      req.end();
    });
  }

  async start() {
    await this.connect();
  await require("./afridigital-core/kernel/v20/redis.stream.bootstrap.cjs").initRedisStreams(this.redis);

    console.log("🚀 Sender Loop Running...");

    while (true) {
      try {
        const res = await this.redis.xRead(
          [{ key: this.streamOut, id: "$"}],
          { COUNT: 1, BLOCK: 5000 }
        );

        if (!res) continue;

        for (const stream of res) {
          for (const msg of stream.messages) {
const { tenantDispatch } = require("./afridigital-core/kernel/v20/tenant.dispatcher.cjs");
            const data = JSON.parse(msg.message.data);
              const tenantId = await resolveTenant(data);
              const decision = await tenantDispatch(this.redis, tenantId, data);
              data.tenantId = tenantId;
              data.decision = decision;

            try {
              console.log("📤 Processing:", data.user);

              await this.sendWhatsApp(data);
              const { generateReply } = require("./ai.autoresponder.cjs");
              const { updateLearning } = require("./ai.feedback.cjs");

              const reply = generateReply(data, decision);

              if (reply) {
                await this.redis.xAdd("wa:outbox", "*", {
                  data: JSON.stringify({
                    user: data.user,
                    text: reply,
                    action: "AUTO_REPLY"
                  })
                });
              }

              await updateLearning(this.redis, data, decision);
              const { updateTenantMemory } = require("./tenant.memory.cjs");
              await updateTenantMemory(this.redis, data.tenantId, data.user, {
                lastIntent: decision.agent,
                score: decision.action === "PRIORITY" ? 1 : 0
              });

              await this.redis.xAck(
                this.streamOut,
                this.group,
                msg.id
              );

              console.log("✅ Delivered:", data.user);

            } catch (err) {
              console.log("❌ Send failed:", err.message);

              await this.handleFailure(msg, data, err.message);
            }
          }
        }

      } catch (err) {
        console.log("❌ Sender loop error:", err.message);
        await new Promise(r => setTimeout(r, 2000));
      }
    }
  }

  async handleFailure(msg, data, error) {
    const retryKey = `retry:${msg.id}`;

    const retries = await this.redis.incr(retryKey);
    await this.redis.expire(retryKey, 86400);

    if (retries >= 3) {
      await this.redis.xAdd("wa:dead", "*", {
        original: JSON.stringify(data),
        error,
        retries: String(retries)
      });

      await this.redis.xAck(this.streamOut, this.group, msg.id);

      console.log("☠️ Moved to DLQ:", data.user);
    }
  }
}

module.exports = WhatsAppSenderLoop;
