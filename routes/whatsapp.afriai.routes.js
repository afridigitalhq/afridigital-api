const express = require("express");
const router = express.Router();

const {
  whatsappWebhook
} = require("../core/integrations/whatsapp-afriai");

/**
 * 📱 WhatsApp AfriAI Incoming Messages
 */
router.post("/webhook/whatsapp", whatsappWebhook);

module.exports = router;
