const express = require("express");
const router = express.Router();

const { runOSCycle } = require("../core/os/autonomous.loop");

router.post("/cycle", async (req, res) => {

  const { user, dataset } = req.body;

  const result = await runOSCycle(user, dataset);

  res.json({
    ok: true,
    state: result
  });
});

module.exports = router;
