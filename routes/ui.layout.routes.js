const express = require("express");
const router = express.Router();

const { buildLayout } = require("../core/ui/personalization/layout.composer");

router.get("/ui/layout/:userId", (req, res) => {

  const layout = buildLayout(req.params.userId);

  res.json({
    ok: true,
    ...layout
  });
});

module.exports = router;
