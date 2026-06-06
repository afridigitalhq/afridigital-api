const express = require("express");
const router = express.Router();

const { buildDashboard } = require("../core/ui/personalized-dashboard/layout.builder");

router.post("/ui/personalized/:userId", (req, res) => {

  const user = {
    id: req.params.userId,
    ...req.body
  };

  const result = buildDashboard(user);

  res.json({
    ok: true,
    ...result
  });
});

module.exports = router;
