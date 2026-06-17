const express = require("express");
const router = express.Router();

// Main shell entry
router.get("/", (req, res) => {
  res.json({
    ok: true,
    dashboard: "afridigital-admin",
    routes: [
      "/admin/overview",
      "/admin/traces",
      "/admin/graph",
      "/admin/metrics",
      "/admin/logs",
      "/admin/control"
    ]
  });
});

// Placeholder panels (UI will upgrade later)
router.get("/overview", (req, res) => res.json({ view: "overview" }));
router.get("/traces", (req, res) => res.json({ view: "traces" }));
router.get("/graph", (req, res) => res.json({ view: "graph" }));
router.get("/metrics", (req, res) => res.json({ view: "metrics" }));
router.get("/logs", (req, res) => res.json({ view: "logs" }));
router.get("/control", (req, res) => res.json({ view: "control-plane" }));

module.exports = router;
