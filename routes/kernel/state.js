const express = require("express");
const router = express.Router();

const { getKernelState, setKernelMode } = require("../../core/kernel-interface");

router.get("/state", (req, res) => {
  res.json(getKernelState());
});

router.post("/mode", (req, res) => {
  const result = setKernelMode(req.body.mode);
  res.json(result);
});

module.exports = router;
