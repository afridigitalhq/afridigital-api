const express = require("express");
const app = express();

app.use(express.json());

let events = [];

// RECEIVE EVENTS FROM SERVICES
app.post("/event", (req, res) => {
  const event = req.body;
  events.push(event);

  // keep memory bounded
  if (events.length > 5000) events.shift();

  res.json({ ok: true });
});

// GLOBAL SNAPSHOT
app.get("/snapshot", (req, res) => {
  const last = events[events.length - 1];

  const summary = {
    totalEvents: events.length,
    lastEvent: last,
    bootEvents: events.filter(e => e.type === "BOOT"),
    listenerEvents: events.filter(e => e.type === "LISTENER"),
    health: calculateHealth(events)
  };

  res.json(summary);
});

function calculateHealth(events) {
  const errors = events.filter(e => e.level === "error").length;
  const total = events.length || 1;
  const score = Math.max(0, 100 - (errors / total) * 100);
  return Math.round(score);
}

const PORT = process.env.COLLECTOR_PORT || 6060;
// app.listen DISABLED(PORT, () => {
  console.log("🧠 CONTROL PLANE COLLECTOR RUNNING ON", PORT);
});
