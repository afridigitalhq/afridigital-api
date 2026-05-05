const express = require("express");
const router = express.Router();
const whatsappController = require("../controllers/whatsappController");

// Webhook verification (Meta)
router.get("/webhook/whatsapp", whatsappController.verify);

// Incoming messages
router.post("/webhook/whatsapp", whatsappController.receive);

module.exports = router;
