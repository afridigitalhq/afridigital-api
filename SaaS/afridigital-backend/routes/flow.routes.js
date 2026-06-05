const express = require("express");
const router = express.Router();
const { generateEvent } = require("../core/flowEngine");

// simple in-memory cache (optional)
let lastEvent = null;

router.get("/event", (req, res) => {
  const event = generateEvent();
  lastEvent = event;
  res.json(event);
});

router.get("/last", (req, res) => {
  res.json(lastEvent || { status: "empty" });
});

module.exports = router;
