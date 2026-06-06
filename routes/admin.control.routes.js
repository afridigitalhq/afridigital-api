const express = require("express");
const router = express.Router();

const { getStream } = require("../admin/control-panel/decision.stream");
const { getGraph } = require("../admin/flowgraph/flowgraph.engine");

router.get("/stream", (req, res) => {
  res.json({
    ok: true,
    stream: getStream()
  });
});

router.get("/flowgraph", (req, res) => {
  res.json({
    ok: true,
    graph: getGraph()
  });
});

module.exports = router;
