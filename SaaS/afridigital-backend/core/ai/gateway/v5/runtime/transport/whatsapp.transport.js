const https = require("https");

class WhatsAppTransport {
  async sendText(to, text) {
    const payload = JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body: text }
    });

    const options = {
      hostname: "graph.facebook.com",
      path: `/v20.0/${process.env.WA_PHONE_ID}/messages`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.WA_TOKEN}`,
        "Content-Type": "application/json"
      }
    };

    return new Promise((resolve, reject) => {
      const req = https.request(options, res => {
        let data = "";

        res.on("data", c => data += c);
        res.on("end", () => resolve({
          status: res.statusCode,
          data
        }));
      });

      req.on("error", reject);
      req.write(payload);
      req.end();
    });
  }
}

module.exports = new WhatsAppTransport();
