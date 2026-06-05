const express = require("express");
const router = express.Router();

const nodes = ["API", "Kernel", "EventBus", "AI Brain", "Database"];
let i = 0;

router.get("/event", (req, res) => {
  const node = nodes[i++ % nodes.length];
  res.json({
    id: "evt_" + Date.now(),
    node,
    action: "execute",
    status: "running",
    timestamp: Date.now()
  });
});

router.get("/health", (req, res) => {
  res.json({
    ok: true,
    engine: "flowgraph"
  });
});

module.exports = router;
