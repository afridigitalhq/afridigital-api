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
app.listen(PORT, () => {
  console.log("🟢 AfriDigital API LIVE on", PORT);
});
