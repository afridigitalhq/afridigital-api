const express = require('express');

const routerHealth = express.Router();
routerHealth.get('/health', (req, res) => {
  res.json({
    ok: true,
    service: "afridigital-api",
    status: "kernel-v2"
  });
});

const routerMetrics = express.Router();
routerMetrics.get('/metrics', (req, res) => {
  res.json({
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

const routerReady = express.Router();
routerReady.get('/ready', (req, res) => {
  res.json({
    ready: true,
    uptime: process.uptime()
  });
});

module.exports = {
  health: routerHealth,
  metrics: routerMetrics,
  ready: routerReady
};
