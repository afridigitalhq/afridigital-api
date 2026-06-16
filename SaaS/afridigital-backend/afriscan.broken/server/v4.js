const express = require('express');
const WebSocket = require('ws');
const http = require('http');

const pipeline = require("../pipeline.js"));
const scoreEngine = require('../v4/score');
require('../v4/heartbeat');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

/**
 * REST API
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    uptime: process.uptime(),
    service: 'afriscan-v4'
  });
});

app.get('/audit', (req, res) => {
  const r = collector();
  const score = scoreEngine();

  res.json({
    state: r.state,
    infra: r.infra,
    score: score.score,
    health: score.state
  });
});

/**
 * LIVE STREAM
 */
wss.on('connection', (ws) => {
  ws.send(JSON.stringify({ event: 'connected' }));

  const interval = setInterval(() => {
    const r = collector();
    const score = scoreEngine();

    ws.send(JSON.stringify({
      event: 'tick',
      state: r.state,
      score: score.score,
      ts: Date.now()
    }));
  }, 3000);

  ws.on('close', () => clearInterval(interval));
});

/**
 * START
 */
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log('🚀 AfriScan v4 running on port', PORT);
});
