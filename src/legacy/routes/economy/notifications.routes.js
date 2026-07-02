const express = require("express");
const router = express.Router();

const notifications = require("../../core/economy/notifications.engine");

router.get("/:userId", (req, res) => {
  res.json(notifications.get(req.params.userId));
});

router.post("/:userId", (req, res) => {
  const note = notifications.add(req.params.userId, req.body);
  res.json(note);
});

module.exports = router;
