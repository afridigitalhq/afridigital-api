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

    await this.redis.connect().catch(() => {});
    console.log("🌉 V20 Webhook Bridge Connected");
  }

  async push(message) {
    try {
      await this.redis.xAdd(this.streamIn, "*", {
        data: JSON.stringify({
          ...message,
          ts: Date.now()
        })
      });
    } catch (err) {
      console.log("❌ Redis push failed:", err.message);
    }
  }

  async start(port = 3000) {
    await this.connect();

    const server = http.createServer((req, res) => {
      if (req.method === "GET" && req.url.startsWith("/webhook")) {

        const url = new URL(req.url, "http://localhost");

        const mode = url.searchParams.get("hub.mode");

        const token = url.searchParams.get("hub.verify_token");

        const challenge = url.searchParams.get("hub.challenge");



        if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {

          res.writeHead(200);

          res.end(challenge);

        } else {

          res.writeHead(403);

          res.end("Forbidden");

        }

        return;

      }

      if (req.method === "POST" && req.url === "/webhook") {

        let body = "";

        req.on("data", chunk => {
          body += chunk;
        });

        req.on("end", () => {

          let data = {};

          try {
            data = JSON.parse(body || "{}");
          } catch (err) {
            console.log("❌ JSON parse error");
          }

          this.push({
            user: data.user || data.from || "unknown",
            text: data.text || data.message || "",
            source: "whatsapp_webhook"
          });

          console.log("📩 Webhook received:", data);

          res.writeHead(200, {
            "Content-Type": "application/json"
          });

          res.end(JSON.stringify({
            ok: true
          }));
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
