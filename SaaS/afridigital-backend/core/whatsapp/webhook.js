// SINGLE_KERNEL_ROUTE=true
const express = require("express");
const router = express.Router();
const { handleMessage } = require("./controller");

router.get("/", (req, res) => {
  res.status(200).json({
    ok: true,
    service: "whatsapp-webhook",
    status: "active"
  });
});

router.post("/", async (req, res) => {
  try {
    await handleMessage(req.body);
    res.status(200).json({ ok: true, received: true });
  } catch (err) {
    console.error("WhatsApp webhook error:", err.message);
    res.status(500).json({ ok: false });
  }
});

module.exports = router;
