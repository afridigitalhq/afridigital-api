const express = require("express");
const router = express.Router();

const activity = require("../../core/economy/activity.engine");

router.get("/:userId", (req, res) => {
  res.json(activity.get(req.params.userId));
});

router.post("/:userId", (req, res) => {
  const entry = activity.log(req.params.userId, req.body.action, req.body.meta);
  res.json(entry);
});

module.exports = router;
