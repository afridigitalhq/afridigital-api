const express = require("express");
const router = express.Router();

const { runEconomyIntelligence } = require("../core/economy/intelligence/orchestrator");

router.post("/analyze", (req, res) => {

  const data = req.body;

  const result = runEconomyIntelligence(data);

  res.json({
    ok: true,
    intelligence: result
  });
});

module.exports = router;
