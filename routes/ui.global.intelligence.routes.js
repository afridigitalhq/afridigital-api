const express = require("express");
const router = express.Router();

const { getGlobalBestUI } = require("../core/ui/global-intelligence/ui.optimizer");

router.get("/ui/global/intelligence", (req, res) => {

  const result = getGlobalBestUI();

  res.json({
    ok: true,
    ...result
  });
});

module.exports = router;
