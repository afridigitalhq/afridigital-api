const express = require("express");
const router = express.Router();

const {
  getFlowGraph,
  replay
} = require("../core/admin/flowgraph");

router.get("/admin/flowgraph/live", (req, res) => {
  res.json(getFlowGraph());
});

router.get("/admin/flowgraph/replay", (req, res) => {

  const { from, to } = req.query;

  res.json(replay(Number(from), Number(to)));
});

module.exports = router;
