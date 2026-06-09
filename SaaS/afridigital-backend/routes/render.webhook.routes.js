const express = require("express");
const router = express.Router();

const brain = require("../core/ci/render/render.ci.brain");
const { verifyRenderWebhook } = require("../core/ci/render/render.verify");

// 🔵 LIVE RENDER DEPLOY WEBHOOK
router.post("/webhooks/render", (req, res) => {
  try {
    if (!verifyRenderWebhook(req)) {
      return res.status(400).json({ error: "invalid payload" });
    }

    brain.handleRenderWebhook(req, res);

  } catch (err) {
    console.error("❌ Render webhook error:", err.message);
    res.status(500).json({ error: "internal error" });
  }
});

module.exports = router;
