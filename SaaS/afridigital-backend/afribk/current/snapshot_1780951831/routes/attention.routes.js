const express = require("express");
const router = express.Router();

const { computeAttention, routeNext } = require("../core/flow/attention/routingEngine");

router.get("/map", (req, res) => {
  res.json(computeAttention());
});

router.get("/route", (req, res) => {
  res.json({
    selected: routeNext()
  });
});

module.exports = router;
