const express = require("express");
const router = express.Router();

const { getTraces } = require("../admin/trace-viewer/trace.stream");
const { getLiveGraph } = require("../admin/trace-viewer/flowgraph.sync");

router.get("/traces", (req, res) => {
  res.json({
    ok: true,
    traces: getTraces()
  });
});

router.get("/live-graph", (req, res) => {
  res.json({
    ok: true,
    graph: getLiveGraph()
  });
});

module.exports = router;
