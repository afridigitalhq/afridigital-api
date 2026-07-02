const express = require("express");
const router = express.Router();

const { buildFeed } = require("../core/feed/feed.engine");

router.post("/generate", (req, res) => {

  const { user } = req.body;

  const feed = buildFeed(user);

  res.json({
    ok: true,
    feed
  });
});

module.exports = router;
