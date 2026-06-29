const express = require("express");
const app = express();

app.use(express.json());

// HEALTH CHECK
app.get("/health", (req, res) => {
  res.json({
    ok: true,
    service: "afridigital-api",
    mode: "safe-bootstrap"
  });
});

// TEST ROUTE
app.post("/afriagent/test", (req, res) => {
  res.json({
    ok: true,
    message: "backend running in safe mode (kernel disabled)"
  });
});

const PORT = process.env.PORT || 3000;

const { emit } = require('./core/event-engine/engine');
const { emit, getEvents } = require("./core/event-engine/engine");

// EVENT STREAM
const { getEvents } = require("./core/event-engine/engine");
app.get("/api/events", (req, res) => {
  res.json({ ok: true, events: getEvents() });
});
app.listen(PORT, () => {
  console.log("🟢 AfriDigital API LIVE on", PORT);
});

/* ================= WEBSOCKET LAYER ================= */
const http = require("http");
const WebSocket = require("ws");

const server = http.createServer(app);

const wss = new WebSocket.Server({
  server,
  path: "/ws/events"
});

function broadcast(event) {
  const data = JSON.stringify(event);
  wss.clients.forEach(c => {
    if (c.readyState === 1) c.send(data);
  });
}

/* ================= EVENT HOOK ================= */
const { emit } = require("./core/event-engine/engine");

const originalEmit = emit;

function wsEmit(type, service, status, msg) {
  const event = originalEmit(type, service, status, msg);
  broadcast(event || { type, service, status, msg });
  return event;
}

module.exports.emit = wsEmit;

/* ================= SERVER SWITCH ================= */
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log("🟢 AfriDigital API + WS LIVE on", PORT);
});
