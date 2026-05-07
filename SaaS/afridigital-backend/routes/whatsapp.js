const express = require("express");
const router = express.Router();
const axios = require("axios");
const whatsappController = require("../controllers/whatsappController");

// Webhook verification (Meta)
router.get("/webhook", whatsappController.verify);

// Incoming messages
router.post("/webhook", whatsappController.receive);

// SEND MESSAGE
router.post("/whatsapp/send", async (req, res) => {
  try {
    const { to, message } = req.body;

    const response = await axios.post(
      `https://graph.facebook.com/v19.0/${process.env.WHATSAPP_PHONE_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: to,
        type: "text",
        text: { body: message }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json({ success: true, data: response.data });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.response?.data || err.message
    });
  }
});

module.exports = router;
