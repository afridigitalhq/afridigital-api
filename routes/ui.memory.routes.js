const express = require("express");
const router = express.Router();

const { getBestUIMode } = require("../core/ui/memory/best.ui.selector");

router.get("/ui/memory/:userId", (req, res) => {

  const result = getBestUIMode(req.params.userId);

  res.json({
    ok: true,
    userId: req.params.userId,
    ...result
  });
});

module.exports = router;
