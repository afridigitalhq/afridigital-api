const express = require("express");
const router = express.Router();

/**
 * WhatsApp webhook - production stable endpoint
 * Safe for Meta / Twilio / custom WhatsApp gateways
 */

router.get("/", (req, res) => {
  res.status(200).json({
    ok: true,
    webhook: "whatsapp",
    mode: "verification",
    status: "active"
  });
});

router.post("/", (req, res) => {
  const payload = req.body || {};

  console.log("📩 WhatsApp Event Received:", JSON.stringify(payload));

  // Minimal safe processing (no dependencies, no async traps)
  return res.status(200).json({
    ok: true,
    received: true
  });
});

module.exports = router;
