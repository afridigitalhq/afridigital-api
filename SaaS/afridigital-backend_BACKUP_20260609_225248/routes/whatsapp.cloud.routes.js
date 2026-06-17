/**
 * 📡 WHATSAPP CLOUD API ROUTES (PRODUCTION)
 * Handles Meta verification + inbound messages
 */

const express = require("express");
const router = express.Router();

const { handleIncomingWhatsApp } =
  require("../../core/ai/whatsapp/autoreply.engine");

// 🔐 VERIFY WEBHOOK (Meta handshake)
router.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    console.log("🟢 WhatsApp webhook verified");
    return res.status(200).send(challenge);
  }

  console.log("🔴 WhatsApp webhook verification failed");
  return res.sendStatus(403);
});

// 📩 INCOMING MESSAGE HANDLER
router.post("/webhook", async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const change = entry?.changes?.[0];
    const value = change?.value;

    const message = value?.messages?.[0];

    if (!message) {
      return res.sendStatus(200);
    }

    const event = {
      data: {
        from: message.from,
        message: message.text?.body || ""
      }
    };

    console.log("📩 WHATSAPP EVENT:", event.data.message);

    const result = await handleIncomingWhatsApp(event);

    return res.status(200).json({
      status: "ok",
      result
    });

  } catch (err) {
    console.error("❌ WhatsApp webhook error:", err.message);
    return res.sendStatus(500);
  }
});

module.exports = router;
