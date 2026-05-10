const fs = require('fs');

const file = 'server.js';
let c = fs.readFileSync(file, 'utf8');

// 1. remove duplicate webhook require inside handler (keep global one)
c = c.replace(/const \{ webhook \} = require\(.+whatsapp\.webhook.+\);/g, "const { webhook } = require('./core/webhooks/whatsapp.webhook');");

// 2. remove nested require inside app.post
c = c.replace(/const \{ webhook \} = require\(.+whatsapp\.webhook.+\);\s*/g, "");

// 3. enforce single clean webhook handler
const handler = `
app.post("/webhook", (req, res) => {
  res.sendStatus(200);

  console.log("🔥 V8.11 WEBHOOK ENTRY HIT");

  setImmediate(async () => {
    try {
      const payload = req.body;

      console.log("📦 RAW PAYLOAD:", JSON.stringify(payload, null, 2));

      await webhook(payload);

      console.log("✅ WEBHOOK PIPELINE FINISHED");
    } catch (err) {
      console.error("❌ WEBHOOK ERROR:", err);
    }
  });
});
`;

// remove old webhook blocks
c = c.replace(/app\.post\("\/webhook"[\s\S]*?\}\);\s*/g, "");

c = c.replace("module.exports = app;", handler + "\n\nmodule.exports = app;\n");

fs.writeFileSync(file, c);

console.log("🚀 V8.11 WEBHOOK CLEAN PATCH APPLIED");
