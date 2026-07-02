const express = require("express");
const router = express.Router();

const {
  pauseStream,
  resumeStream,
  flagSignal,
  overrideDecision,
  getControlCenterSnapshot
} = require("../core/admin/control-center-v2");

router.get("/admin/control-center", (req, res) => {
  res.json(getControlCenterSnapshot());
});

router.post("/admin/control-center/pause", (req, res) => {
  pauseStream();
  res.json({ ok: true, mode: "PAUSED" });
});

router.post("/admin/control-center/resume", (req, res) => {
  resumeStream();
  res.json({ ok: true, mode: "LIVE" });
});

router.post("/admin/control-center/flag", (req, res) => {
  flagSignal(req.body);
  res.json({ ok: true });
});

router.post("/admin/control-center/override", (req, res) => {
  overrideDecision(req.body);
  res.json({ ok: true });
});

module.exports = router;
