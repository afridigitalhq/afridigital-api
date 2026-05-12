const express = require("express");
const router = express.Router();
const engine = require("../services/whatsapp.engine");

router.post("/webhook", (req, res) => {
  console.log("🔥 WEBHOOK HIT");
  console.log("📩 BODY:", JSON.stringify(req.body));

  const entry = req.body?.entry || [];

  entry.forEach(e => {
    (e.changes || []).forEach(c => {
      (c.value?.messages || []).forEach(m => {
        const from = m.from;
        const text = m.text?.body || "";

        console.log("📥 MESSAGE:", from, text);

        engine.enqueue({ from, text });
        console.log("ENQUEUE HIT");
      });
    });
  });

  res.sendStatus(200);
});

module.exports = router;
