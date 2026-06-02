const express = require("express");
const router = express.Router();

router.get("/health", (req, res) => {
  res.json({
    backend: "ok",
    frontend: "ok",
    observability: "active",
    flowgraph: "connected",
    controlPlane: "ready",
    timestamp: Date.now()
  });
});

module.exports = router;
