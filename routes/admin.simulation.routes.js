const express = require("express");
const router = express.Router();

const {
  runSimulation
} = require("../core/admin/simulation-lab");

router.post("/admin/simulate", (req, res) => {

  const result = runSimulation(req.body || {});

  res.json(result);
});

module.exports = router;
