const express = require("express");
const router = express.Router();
const { processJob } = require("../services/whatsapp.engine");

console.log("🧩 WEBHOOK MODULE ACTIVE");

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
          const text = m.text?.body;

          console.log("📥 MESSAGE:", from, text);

          if (processJob) {
            await processJob({ from, text });
          }
        }
      }
    }

    res.sendStatus(200);
  } catch (err) {
    console.log("💥 WEBHOOK ERROR:", err.message);
    res.sendStatus(200);
  }
});

module.exports = router;
