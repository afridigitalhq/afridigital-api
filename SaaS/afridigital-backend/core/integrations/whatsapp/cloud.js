const https = require("https");

class WhatsAppCloud {
  constructor() {
    this.token = config.get("whatsapp.token") || "";
    this.phoneId = config.get("whatsapp.phoneId") || "";
  }

  async sendText(to, text) {
    const payload = JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body: text }
    });

    const options = {
      hostname: "graph.facebook.com",
      path: `/v20.0/${this.phoneId}/messages`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json"
      }
    };

    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let data = "";

        res.on("data", (c) => (data += c));
        res.on("end", () => {
          resolve({
            status: res.statusCode,
            data: JSON.parse(data || "{}")
          });
        });
      });

      req.on("error", reject);
      req.write(payload);
      req.end();
    });
  }
}

module.exports = new WhatsAppCloud();
