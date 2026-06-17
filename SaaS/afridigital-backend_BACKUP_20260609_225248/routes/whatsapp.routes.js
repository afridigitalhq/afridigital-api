const express = require("express");
const router = express.Router();
const { whatsappWebhook } = require("../core/realtime/bridge/whatsapp.bridge");

// WhatsApp Cloud API webhook entry
router.post("/webhook", whatsappWebhook);

// verification endpoint (Meta handshake)
router.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }

  res.sendStatus(403);
});

module.exports = router;
