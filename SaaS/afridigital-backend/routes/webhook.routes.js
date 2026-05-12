const express = require("express");
const router = express.Router();
const engine = require("../services/whatsapp.engine");

// 🔥 WEBHOOK ENTRY
router.post("/webhook", (req, res) => {
  console.log("🔥 WEBHOOK HIT");
  console.log("📩 BODY:", JSON.stringify(req.body));

  try {
    const entry = req.body?.entry || [];

    entry.forEach(e => {
      const changes = e.changes || [];

      changes.forEach(c => {
        const messages = c.value?.messages || [];

        messages.forEach(m => {
          const from = m.from;
          const text = m.text?.body || "";

          console.log("📥 MESSAGE RECEIVED:", from, text);

          engine.enqueue({
            from,
            text
          });

          console.log("ENQUEUE HIT");
        });
      });
    });

    res.sendStatus(200);
  } catch (err) {
    console.error("WEBHOOK ERROR:", err.message);
    res.sendStatus(500);
  }
});

module.exports = router;
