const router = require('express').Router();
const { processWebhook } = require("../services/whatsapp-gateway/core/whatsappEngineV2");

router.post("/", async (req, res) => {
  try {
    await processWebhook(req.body);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

module.exports = router;
