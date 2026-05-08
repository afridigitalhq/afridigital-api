const express = require("express");
const router = express.Router();

const control = require("../modules/control-plane");

// GET SYSTEM STATUS
router.get("/status", (req, res) => {
  res.json({
    ok: true,
    state: control.getState()
  });
});

// TOGGLE AGENT
router.post("/agent/toggle", (req, res) => {
  const { name, value } = req.body;

  control.toggleAgent(name, value);

  res.json({
    ok: true,
    message: `${name} set to ${value}`
  });
});

module.exports = router;
