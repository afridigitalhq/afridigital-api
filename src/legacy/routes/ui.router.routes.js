const express = require("express");
const router = express.Router();

const { resolveDashboard } = require("../core/ui/router/router.engine");

router.post("/ui/router/:userId", (req, res) => {

  const user = {
    id: req.params.userId,
    ...req.body
  };

  const result = resolveDashboard(user);

  res.json({
    ok: true,
    userId: user.id,
    ...result
  });
});

module.exports = router;
