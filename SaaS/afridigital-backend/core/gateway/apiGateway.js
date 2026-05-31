const router = require("express").Router();
const { emit } = require("../queue/jobQueue");

router.post("/ai", async (req, res) => {
  const streamId = Date.now().toString();

  emit("api.ai", {
    user: req.body.user,
    text: req.body.text,
    streamId
  });

  res.json({
    ok: true,
    status: "streaming",
    streamId
  });
});

module.exports = router;
