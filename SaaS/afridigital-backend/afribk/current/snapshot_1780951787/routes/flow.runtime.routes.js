const express = require("express");
const router = express.Router();
const { runFlow } = require("../core/flow/flowRuntime");

router.post("/execute", (req, res) => {
  const result = runFlow(req.body || {}, {
    user: req.body?.user
  });

  res.json(result);
});

module.exports = router;
