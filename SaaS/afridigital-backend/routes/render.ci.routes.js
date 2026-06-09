const express = require("express");
const router = express.Router();
const brain = require("../core/ci/render/render.ci.brain");

// 🌐 Render webhook endpoint
router.post("/render/webhook", (req, res) => {
  brain.handleRenderWebhook(req, res);
});

// 🧪 manual test trigger
router.get("/render/test", (req, res) => {
  brain.ingest({
    service: "render",
    status: "deploy_started",
    message: "manual test event"
  });

  res.json({ ok: true });
});

module.exports = router;
