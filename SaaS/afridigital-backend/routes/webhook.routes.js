const express = require("express");
const router = express.Router();
const engine = require("../services/whatsapp.engine");

console.log("🧩 WEBHOOK MODULE LIVE");

router.post("/", async (req, res) => {
  try {
    console.log("🔥 WEBHOOK HIT");
    console.log("📦 RAW:", JSON.stringify(req.body));

    const entries = req.body?.entry || [];

    for (const e of entries) {
      for (const c of e.changes || []) {
        const messages = c.value?.messages || [];

        for (const m of messages) {
          const from = m.from;
          const text = m.text?.body || m.text;

          console.log("📥 MESSAGE:", { from, text });

          if (!engine || !engine.processJob) {
            console.log("⚠️ ENGINE MISSING OR INVALID");
          } else {
            console.log("🚀 CALLING PROCESSJOB");
            await engine.processJob({ from, text });
            console.log("✅ PROCESSJOB COMPLETED");
          }
        }
      }
    }

    res.sendStatus(200);
  } catch (err) {
    console.log("💥 WEBHOOK ERROR:", err?.stack || err.message);
    res.sendStatus(200);
  }
});

module.exports = router;
