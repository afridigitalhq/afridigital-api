const express = require('express');
const pipeline = require("../pipeline.js"));
const v3 = require('../v3/control');

const app = express();

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    uptime: process.uptime(),
    service: 'afriscan-control-plane'
  });
});

app.get('/audit', (req, res) => {
  const r = collector();
  const control = v3();

  res.json({
    score: r.score,
    state: r.state,
    uptime: r.uptime,
    infra: r.infra,
    architecture: control.architecture
  });
});

app.get('/metrics', (req, res) => {
  const r = collector();
  res.json(r.telemetry || { cpu: 0, ram: 0, requests: 0 });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('🚀 AfriScan Control Plane running on port', PORT);
});
