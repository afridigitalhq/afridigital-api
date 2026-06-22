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

app.get("/api/topology", (req, res) => {
  const { getAttackTopology } = require("./core/intelligence/attack.topology");
  res.json({ ok: true, topology: getAttackTopology() });
});
  res.json({ ok: true, insights: getInsights() });
});

/* ================= WS PLACEHOLDER (PHASE NEXT) ================= */

/* ================= START ================= */

server.listen(PORT, () => {
  console.log("🟢 AfriDigital API CORE LIVE on", PORT);
});
