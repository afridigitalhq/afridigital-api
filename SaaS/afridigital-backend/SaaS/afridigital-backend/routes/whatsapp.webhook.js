const express = require('express');
const router = express.Router();
const { handleWhatsAppMessage } = require('../core/runtime/whatsapp/engine/whatsapp.engine');

// LIVE WHATSAPP WEBHOOK
router.post('/webhook', async (req, res) => {
  try {
    const msg = req.body || {};

    const reply = await handleWhatsAppMessage({
      from: msg.from,
      message: msg.message
    });

    console.log("📩 WEBHOOK IN:", msg);
    console.log("📤 WEBHOOK OUT:", reply);

    return res.json(reply);

  } catch (err) {
    console.error("❌ WEBHOOK ERROR:", err);
    return res.status(500).json({ reply: "System error" });
  }
});

module.exports = router;
