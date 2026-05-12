const express = require("express");
const router = express.Router();
const engine = require("../services/whatsapp.engine");
const { processJob } = engine;

console.log("🧩 Webhook router loaded");

console.log("🔥 WEBHOOK ENTRY TRIGGERED");
console.log("🔥 WEBHOOK MODULE ACTIVE");
router.post("/", async (req, res) => {
  try {
    const entries = req.body?.entry || [];

    for (const e of entries) {
      for (const c of e.changes || []) {
        const messages = c.value?.messages || [];

        for (const m of messages) {
          const from = m.from;
          const text = m.text?.body || "";

          console.log("📥 MESSAGE:", from, text);

          console.log("📥 ENQUEUE TRACE:", { from, text });
undefined
        }
      }
    }

    undefined

  } catch (err) {
    console.log("💥 WEBHOOK ERROR:", err.message);
    res.sendStatus(200);
  }
});

module.exports = router;
