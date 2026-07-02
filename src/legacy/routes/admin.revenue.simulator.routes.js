const express = require("express");
const router = express.Router();

const {
  simulateRevenueImpact
} = require("../core/ai/revenue-simulator");

router.post("/admin/revenue/simulate", (req, res) => {

  const result = simulateRevenueImpact(req.body || {});

  res.json(result);
});

module.exports = router;
