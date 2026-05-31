const https = require("https");

class WhatsAppCloudV2 {
  constructor() {
    this.token = process.env.WHATSAPP_TOKEN;
    this.phoneId = process.env.PHONE_NUMBER_ID;
    this.base = "graph.facebook.com";
  }

  sendText(to, text) {
    return new Promise((resolve, reject) => {
      const payload = JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body: text }
      });

      const options = {
        hostname: this.base,
        path: `/v20.0/${this.phoneId}/messages`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json"
        }
      };

      const req = https.request(options, res => {
        let data = "";
        res.on("data", c => data += c);
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

module.exports = new WhatsAppCloudV2();
