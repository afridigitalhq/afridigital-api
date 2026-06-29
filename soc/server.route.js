const express = require("express");
const { snapshot } = require("./api/soc.api");

const router = express.Router();

router.get("/soc/snapshot", (req, res) => {
  res.json(snapshot());
});

module.exports = router;
