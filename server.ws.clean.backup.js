const express = require("express");
const http = require("http");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

/* ================= EVENT ENGINE ================= */
const { emit, getEvents, replay, getInsights } = require("./core/event-engine/engine");

/* ================= HTTP SERVER ================= */
const server = http.createServer(app);

/* ================= HEALTH ================= */
app.get("/health", (req, res) => {
  res.json({ ok: true, service: "afridigital-api", mode: "ws-ready" });
});

/* ================= EVENTS ================= */
app.get("/api/events", (req, res) => {
  res.json({ ok: true, events: getEvents() });
});

app.get("/api/events/history", (req, res) => {
  const from = parseInt(req.query.from || "0");
  const to = parseInt(req.query.to || "999999");
  res.json({ ok: true, events: replay(from, to) });
});

app.get("/api/events/insights", (req, res) => {
  res.json({ ok: true, insights: getInsights() });
});

/* ================= WS PLACEHOLDER (PHASE NEXT) ================= */
/* WebSocket layer will be attached in next step cleanly */

/* ================= START ================= */
const WebSocket = require("ws");
const { initWS } = require("./core/realtime/ws/stream.bridge");
const ws = initWS(server);
const { initWS } = require("./core/realtime/ws/stream.bridge");

server.listen(PORT, () => {
  console.log("🟢 AfriDigital API CORE LIVE on", PORT);
});
