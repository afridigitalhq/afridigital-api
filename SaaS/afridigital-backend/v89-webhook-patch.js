const fs = require('fs');

let file = fs.readFileSync('server.js', 'utf8');

/**
 * Remove existing webhook route safely
 * (matches app.post("/webhook"... ) block)
 */
file = file.replace(/app\.post\(["']\/webhook["'][\s\S]*?\n\}\);/g, '');

/**
 * Inject V8.9 SAFE WEBHOOK
 */
const webhookPatch = `
app.post("/webhook", (req, res) => {
  // 1. ALWAYS ACK IMMEDIATELY
  res.sendStatus(200);

  // 2. SAFE BACKGROUND PROCESSING
  setImmediate(async () => {
    try {
      const payload = req.body;

      if (!payload) {
        console.warn("⚠️ Empty webhook payload");
        return;
      }

      console.log("📩 WEBHOOK RECEIVED:", JSON.stringify(payload).slice(0, 200));

      const { webhook } = require("./core/webhooks/whatsapp.webhook");
      await webhook(payload);

      console.log("✅ WEBHOOK PROCESSED SUCCESSFULLY");
    } catch (err) {
      console.error("❌ WEBHOOK PROCESSING ERROR:", err);
    }
  });
});
`;

/**
 * Insert before listen block
 */
file = file.replace(
  /const PORT = process\.env\.PORT \|\| 10000;/,
  webhookPatch + "\n\nconst PORT = process.env.PORT || 10000;"
);

fs.writeFileSync('server.js', file);
console.log("🚀 V8.9 WEBHOOK PATCH APPLIED SUCCESSFULLY");
