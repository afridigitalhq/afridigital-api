const express = require("express");
const router = express.Router();
const engine = require("../services/whatsapp.engine");
const { createTrace, log } = require("../utils/trace");

console.log("🧩 WEBHOOK OBSERVABILITY ACTIVE");

router.post("/", async (req, res) => {
  const traceId = createTrace();

  try {
    log(traceId, "WEBHOOK_RECEIVED", { body: req.body });

    const entries = req.body?.entry || [];

    for (const e of entries) {
      for (const c of e.changes || []) {

        const messages = c.value?.messages || [];

        for (const m of messages) {
          const from = m.from;
          const text = m.text?.body || m.text || "";

          log(traceId, "MESSAGE_PARSED", { from, text });

          await engine.processJob({
            traceId,
            from,
            text
          });

          log(traceId, "JOB_COMPLETED", { from });
        }
      }
    }

    res.sendStatus(200);

  } catch (err) {
    log(traceId, "WEBHOOK_ERROR", {
      error: err.message
    });

    res.sendStatus(200);
  }
});

module.exports = router;
