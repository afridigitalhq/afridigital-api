const http = require("http");
const { createClient } = require("redis");

class WebhookBridge {
  constructor() {
    this.redis = null;
    this.streamIn = "wa:inbox";
  }

  async connect() {
    this.redis = createClient({
      url: process.env.REDIS_URL || "redis://localhost:6379"
    });

    await this.redis.connect().catch(e => console.log("Redis retry")).catch(() => {});
const { ensureStreams } = require("./redis.stream.guard.cjs"); await ensureStreams(this.redis);
    console.log("🌉 V20 Webhook Bridge Connected");
  }

  async push(message) {
    const payload = {
      ...message,
      ts: Date.now()
    };

    this.redis?.xAdd(this.streamIn, "*", {
      data: JSON.stringify(payload)
    });

    return { ok: true };
  }

  async start(port = process.env.PORT || 3000) {
    await this.connect();

    const server = http.createServer(async (req, res) => {
      if (req.method === "POST" && req.url === "/webhook") {
        let body = "";

        req.on("data", chunk => body += chunk);
        req.on("end", async () => {
          try {
            const data = JSON.parse(body || "{}");

            const result = await this.push({
              user: data.user || data.from || "unknown",
              text: data.text || data.message || "",
              source: "whatsapp_webhook"
            });

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(result));

            console.log("📩 Webhook received:", data);
          } catch (err) {
            res.writeHead(500);
            res.end("error");
          }
        });

        return;
      }

      res.writeHead(200);
      res.end("V20 Webhook Bridge Active");
    });

    server.listen(port, () => {
      console.log("🚀 Webhook Bridge running on port", port);
    });
  }
}

module.exports = WebhookBridge;
