const { createClient } = require("redis");
const https = require("https");

class WhatsAppSenderLoop {
  constructor() {
    this.redis = null;
    this.streamOut = "wa:outbox";
  }

  async connect() {
    this.redis = createClient({
      url: process.env.REDIS_URL || "redis://localhost:6379"
    });

    await this.redis.connect().catch(() => {});
    console.log("📤 V20 Sender Loop Connected");
  }

  async sendWhatsApp(message) {
    const token = process.env.WHATSAPP_TOKEN;
    const phoneId = process.env.WHATSAPP_PHONE_ID;

    const payload = JSON.stringify({
      messaging_product: "whatsapp",
      to: message.user,
      type: "text",
      text: {
        body: `AI: ${message.text || "Processed"} | Action: ${message.action || "none"}`
      }
    });

    const options = {
      hostname: "graph.facebook.com",
      path: `/v19.0/${phoneId}/messages`,
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    };

    return new Promise((resolve, reject) => {
      const req = https.request(options, res => {
    const dup = await isDuplicate(this.redis, payload.message_id || payload.id || Date.now()); 
    if (dup) { console.log("🟡 Duplicate blocked:", payload.message_id); return; }
        let data = "";
        res.on("data", chunk => data += chunk);
        res.on("end", () => resolve(data));
      });

      req.on("error", reject);
      req.write(payload);
      req.end();
    });
  }

  async start() {
    await this.connect();

    console.log("🚀 V20 Sender Loop Running...");

    while (true) {
      try {
        const res = await this.redis.xRead(
          [{ key: this.streamOut, id: ">" }],
          { COUNT: 1, BLOCK: 5000 }
        );

        if (!res) continue;

        for (const stream of res) {
          for (const msg of stream.messages) {
            const data = JSON.parse(msg.message.data);

            console.log("📤 Sending WhatsApp:", data);

            await this.sendWhatsApp(data);

            console.log("✅ Sent:", data.user);
          }
        }

      } catch (err) {
        console.log("❌ Sender error:", err.message);
        await new Promise(r => setTimeout(r, 1000));
      }
    }
  }
}

module.exports = WhatsAppSenderLoop;
