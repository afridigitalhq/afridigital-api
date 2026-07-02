const express = require("express");
const router = express.Router();

const { morphLayout } = require("../core/ui/morphing/morph.engine");

router.post("/ui/morph/:userId", (req, res) => {

  const layout = morphLayout(
    req.params.userId,
    req.body.currentLayout || []
  );

  res.json({
    ok: true,
    ...layout
  });
});

module.exports = router;
