const express = require("express");
const router = express.Router();

const { matchUser } = require("../core/marketplace/matcher.engine");

router.post("/match", (req, res) => {

  const { user, jobs, earn, services } = req.body;

  const result = matchUser(user, jobs, earn, services);

  res.json({
    ok: true,
    result
  });
});

module.exports = router;
