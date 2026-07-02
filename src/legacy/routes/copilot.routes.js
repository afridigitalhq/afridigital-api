const express = require("express");
const router = express.Router();

const { buildCoPilotFlow } = require("../core/ai/copilot");

router.post("/copilot/create", (req, res) => {

  const result = buildCoPilotFlow(
    req.body,
    {
      jobs: req.body.jobs || [],
      services: req.body.services || []
    }
  );

  res.json({
    ok: true,
    ...result
  });
});

module.exports = router;
