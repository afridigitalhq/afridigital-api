const fs = require('fs');

let file = fs.readFileSync('server.js', 'utf8');

/**
 * 1. Remove old webhook block safely
 */
file = file.replace(/app\.post\(["']\/webhook["'][\s\S]*?\}\);\s*\}\);/g, '');

/**
 * 2. Ensure single import exists
 */
if (!file.includes("core/webhooks/whatsapp.webhook")) {
  file = `const { webhook } = require('./core/webhooks/whatsapp.webhook');\n\n` + file;
}

/**
 * 3. Inject clean V8.10 webhook
 */
const cleanWebhook = `
app.post("/webhook", (req, res) => {

  // ALWAYS ACK IMMEDIATELY
  res.sendStatus(200);

  console.log("🔥 V8.10 WEBHOOK ENTRY HIT");

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

/**
 * 4. Insert before listen block
 */
file = file.replace(
  /const PORT = process\.env\.PORT \|\| 10000;/,
  cleanWebhook + "\n\nconst PORT = process.env.PORT || 10000;"
);

fs.writeFileSync('server.js', file);
console.log("🚀 V8.10 WEBHOOK CLEAN PATCH APPLIED");
