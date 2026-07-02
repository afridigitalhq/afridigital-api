const express = require("express");
const router = express.Router();

const { runGrowthEngine } = require("../core/marketplace/growth-engine");

router.post("/marketplace/growth/analyze", (req, res) => {

  const result = runGrowthEngine({
    jobs: req.body.jobs || [],
    services: req.body.services || []
  });

  res.json({
    ok: true,
    ...result
  });
});

module.exports = router;
