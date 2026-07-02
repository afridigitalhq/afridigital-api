const express = require("express");
const router = express.Router();

const {
  replayTrace,
  getAllTraces
} = require("../core/admin/replay-engine");

router.get("/admin/replay", (req, res) => {

  const { traceId } = req.query;

  if (traceId) {
    return res.json(replayTrace(Number(traceId)));
  }

  res.json(getAllTraces());
});

module.exports = router;
