const https = require("https");

class V20Runtime {
  constructor(fraudEngine) {
    this.queue = [];
    this.fraud = fraudEngine;
    this.running = false;
  }

  push(message) {
    this.queue.push(message);
  }

  async sendWhatsApp(message) {
    const token = process.env.WHATSAPP_TOKEN;
    const phoneId = process.env.WHATSAPP_PHONE_ID;

    const payload = JSON.stringify({
      messaging_product: "whatsapp",
      to: message.user,
      type: "text",
      text: {
        body: `AI: ${message.text} | Action: ${message.action}`
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
        let data = "";
        res.on("data", c => data += c);
        res.on("end", () => resolve(data));
      });

      req.on("error", reject);
      req.write(payload);
      req.end();
    });
  }

  async start() {
    if (this.running) return;
    this.running = true;

    console.log("🚀 V20 SINGLE RUNTIME ACTIVE");

    while (this.running) {
      const msg = this.queue.shift();

      if (!msg) {
        await new Promise(r => setTimeout(r, 300));
        continue;
      }

      try {
        const result = await this.fraud.analyze({
          event: msg.text || "MESSAGE",
          payload: { user: msg.user }
        });

        const enriched = {
          ...msg,
          action: result.action,
          score: result.score
        };

        await this.sendWhatsApp(enriched);

        console.log("📤 REPLIED:", enriched.user);

      } catch (err) {
        console.log("❌ Runtime error:", err.message);
      }
    }
  }
}

module.exports = V20Runtime;
