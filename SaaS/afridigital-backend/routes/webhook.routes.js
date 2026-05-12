const express = require("express");
const router = express.Router();
const engine = require("../services/whatsapp.engine");

console.log("🧩 Webhook router loaded");

// SAFE WEBHOOK (NO CRASH ALLOWED)
router.post("/", async (req, res) => {
  try {
    console.log("🔥 WEBHOOK HIT");
    console.log("📩 BODY:", JSON.stringify(req.body));

    const entries = req.body?.entry || [];

    for (const e of entries) {
      for (const c of e.changes || []) {
        const messages = c.value?.messages || [];

        for (const m of messages) {
          const from = m.from;
          const text = m.text?.body || "";

          console.log("📥 MESSAGE:", from, text);

          try {
            await engine.enqueue({ from, text });
            console.log("ENQUEUE HIT");
          } catch (err) {
            console.log("💥 ENGINE ERROR:", err.message);
          }
        }
      }
    }

    res.sendStatus(200);

  } catch (err) {
    console.log("💥 WEBHOOK CRASH:", err);
    res.sendStatus(200); // NEVER break webhook
  }
});

module.exports = router;
