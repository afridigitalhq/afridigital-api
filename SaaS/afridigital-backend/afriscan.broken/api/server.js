const express = require("express");
const collect = require("../truth/collector");
const scoreFn = require("../utils/score");

const app = express();

let lastSnapshot = null;
let history = [];

function snapshot() {
  const truth = collect();
  const scored = scoreFn(truth);

  const data = {
    timestamp: new Date().toISOString(),
    truth,
    score: scored.score,
    breakdown: scored.breakdown
  };

  lastSnapshot = data;
  history.push(data);

  if (history.length > 200) history.shift();

  return data;
}

// refresh snapshot every 2s (engine layer)
setInterval(snapshot, 2000);

// initial warmup
snapshot();

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/snapshot", (req, res) => {
  res.json(lastSnapshot);
});

app.get("/score", (req, res) => {
  res.json({
    score: lastSnapshot?.score || 0,
    breakdown: lastSnapshot?.breakdown || {}
  });
});

app.get("/history", (req, res) => {
  res.json(history);
});

app.get("/alerts", (req, res) => {
  const score = lastSnapshot?.score || 0;

  res.json({
    status: score < 60 ? "DEGRADED" : "STABLE",
    alert: score < 60 ? "RISK ACTIVE" : "OK"
  });
});

const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
  console.log(`🧠 AfriScan Control Plane running on ${PORT}`);
});
