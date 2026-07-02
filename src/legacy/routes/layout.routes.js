const express = require("express");
const router = express.Router();

const { buildLayout } = require("../core/layout/layout.engine");

router.post("/generate", (req, res) => {

  const { user, feed } = req.body;

  const layout = buildLayout(user, feed);

  res.json({
    ok: true,
    layout
  });
});

module.exports = router;
