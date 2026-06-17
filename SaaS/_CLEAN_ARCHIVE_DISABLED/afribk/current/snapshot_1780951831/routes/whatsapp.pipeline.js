const express = require("express");
const router = express.Router();
const { runPipeline } = require("../core/whatsapp/pipeline");

router.post("/", (req, res) => {
  const result = runPipeline(req);

  console.log("📡 WhatsApp Pipeline:", result);

  res.json({
    ok: true,
    intent: result.intent,
    flow: result.flow
  });
});

module.exports = router;
