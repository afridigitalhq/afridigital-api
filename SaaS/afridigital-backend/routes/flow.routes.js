const express = require("express");
const router = express.Router();

const { emitFlowEvent } = require("../core/flow/engine");

router.get("/event", (req, res) => {
  res.json(emitFlowEvent("api"));
});

router.get("/health", (req, res) => {
  res.json({
    ok: true,
    engine: "afribrain-flow",
    websocket: true,
    redis: true
  });
});

module.exports = router;
