const express = require("express");
const router = express.Router();

const kernel = require("../../admin-console/window-manager/window.kernel");

router.get("/state", (req, res) => {
  res.json(kernel.getWindowState());
});

router.post("/workspace/save", (req, res) => {
  res.json(kernel.saveWorkspace(req.body.name || "default"));
});

router.post("/workspace/load", (req, res) => {
  kernel.loadWorkspace(req.body.snapshot);
  res.json({ ok: true });
});

module.exports = router;
