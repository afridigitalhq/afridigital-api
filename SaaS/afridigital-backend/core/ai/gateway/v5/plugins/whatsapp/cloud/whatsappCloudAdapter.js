const https = require("https");

class WhatsAppCloudAdapter {
  constructor() {
    this.token = process.env.WHATSAPP_TOKEN || "";
    this.phoneId = process.env.WHATSAPP_PHONE_ID || "";
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
        "Authorization": `Bearer ${this.token}`,
        "Content-Type": "application/json"
      }
    };

    return new Promise((resolve, reject) => {
      const req = https.request(options, res => {
        let data = "";
        res.on("data", chunk => data += chunk);
        res.on("end", () => resolve({ status: res.statusCode, data }));
      });

      req.on("error", reject);
      req.write(payload);
      req.end();
    });
  }
}

module.exports = new WhatsAppCloudAdapter();
