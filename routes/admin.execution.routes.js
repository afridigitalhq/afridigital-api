const express = require("express");
const router = express.Router();

const {
  executeAction,
  rollback,
  getExecutionLog
} = require("../core/admin/execution-pipeline");

const { getLatestSnapshot } = require("../core/admin/snapshots");

router.post("/admin/execute", (req, res) => {
  const result = executeAction({}, req.body);
  res.json(result);
});

router.post("/admin/rollback", (req, res) => {
  const snap = getLatestSnapshot();
  const result = rollback({}, snap);
  res.json(result);
});

router.get("/admin/execution-log", (req, res) => {
  res.json(getExecutionLog());
});

module.exports = router;
