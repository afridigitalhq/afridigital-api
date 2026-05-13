const express = require("express");
const router = express.Router();
const engine = require("../services/whatsapp.engine");

console.log("🧩 WEBHOOK MODULE (ATOMIC TRACE)");

router.post("/", async (req, res) => {
  try {
    console.log("⚛️ TRACE:WEBHOOK_HIT");

    const entries = req.body?.entry || [];

    for (const e of entries) {
      for (const c of e.changes || []) {

        const messages = c.value?.messages || [];

        for (const m of messages) {
          const from = m.from;
          const text = m.text?.body || m.text || "";

          console.log("⚛️ TRACE:INCOMING", { from, text });

          if (!engine?.processJob) {
            console.log("⚠️ TRACE:ENGINE_MISSING");
            continue;
          }

          console.log("⚛️ TRACE:CALL_PROCESSJOB");

          await engine.processJob({ from, text });

          console.log("⚛️ TRACE:PROCESS_DONE");
        }
      }
    }

    res.sendStatus(200);

  } catch (err) {
    console.log("💥 TRACE:WEBHOOK_ERROR", err?.stack || err.message);
    res.sendStatus(200);
  }
});

module.exports = router;
