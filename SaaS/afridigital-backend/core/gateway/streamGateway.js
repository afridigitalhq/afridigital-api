const router = require("express").Router();
const { subscribe } = require("../stream/streamManager");

router.get("/:id", (req, res) => {
  const id = req.params.id;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");

  subscribe(id, (event) => {
    res.write(`data: ${JSON.stringify(event)}\n\n`);
  });
});

module.exports = router;
