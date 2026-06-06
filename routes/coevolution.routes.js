const express = require("express");
const router = express.Router();

const { generateInsights } = require("../core/coevolution/insights.engine");

router.get("/coevolution/insights", (req, res) => {

  const insights = generateInsights();

  res.json({
    ok: true,
    insights
  });
});

module.exports = router;
