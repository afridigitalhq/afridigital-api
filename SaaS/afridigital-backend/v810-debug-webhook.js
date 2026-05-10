const fs = require('fs');

let file = fs.readFileSync('server.js', 'utf8');

/**
 * Inject debug logs into webhook safely
 */
file = file.replace(
  /app\.post\(["']\/webhook["'][\s\S]*?setImmediate[\s\S]*?\}\);\s*\}\);/,
  `app.post("/webhook", (req, res) => {

  // 1. ALWAYS ACK IMMEDIATELY
  res.sendStatus(200);

  // 2. DEBUG ENTRY LOG
  console.log("🔥 V8.10 WEBHOOK ENTRY HIT");

  setImmediate(async () => {
    try {
      const payload = req.body;

      console.log("📦 RAW PAYLOAD:", JSON.stringify(payload, null, 2));

      const { webhook } = require("./core/webhooks/whatsapp.webhook");
      await webhook(payload);

      console.log("✅ WEBHOOK PIPELINE FINISHED");

    } catch (err) {
      console.error("❌ WEBHOOK ERROR:", err);
    }
  });
});`
);

fs.writeFileSync('server.js', file);
console.log("🚀 V8.10 WEBHOOK DEBUG PATCH APPLIED");
