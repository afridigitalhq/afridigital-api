const express = require("express");
const router = express.Router();
const engine = require("../services/whatsapp.engine");

console.log("🧩 Webhook router loaded");

// ACCEPT ALL METHODS FOR DEBUG
router.all("/webhook", (req, res) => {
  console.log("🔥 WEBHOOK HIT");
  console.log("📩 METHOD:", req.method);
  console.log("📩 BODY:", req.body);

  const entries = req.body?.entry || [];

  for (const e of entries) {
    for (const c of e.changes || []) {
      const messages = c.value?.messages || [];

      for (const m of messages) {
        const from = m.from;
        const text = m.text?.body || "";

        console.log("📥 MESSAGE:", from, text);

        engine.enqueue({ from, text });
        console.log("ENQUEUE HIT");
      }
    }
  }

  res.sendStatus(200);
});

module.exports = router;
