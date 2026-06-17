const express = require("express");
const fs = require("fs");
const app = express();

const PORT = process.env.OBS_PORT || 5050;

let clients = [];

// STREAM LOGS (REAL TIME)
app.get("/stream", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");

  clients.push(res);

  req.on("close", () => {
    clients = clients.filter(c => c !== res);
  });
});

// BROADCAST FUNCTION
function broadcast(data) {
  clients.forEach(c => c.write(`data: ${JSON.stringify(data)}\n\n`));
}

// WATCH OBS LOG FILE
const logFile = "logs/runtime-observability.log";

fs.watchFile(logFile, () => {
  try {
    const lines = fs.readFileSync(logFile, "utf8")
      .trim()
      .split("\n")
      .slice(-1)[0];

    if (lines) broadcast(JSON.parse(lines));
  } catch {}
});

// SNAPSHOT API
app.get("/snapshot", (req, res) => {
  try {
    const logs = fs.readFileSync(logFile, "utf8")
      .trim()
      .split("\n")
      .map(l => JSON.parse(l));

    const summary = {
      totalEvents: logs.length,
      lastEvent: logs[logs.length - 1],
      bootPhases: logs.filter(l => l.event === "PHASE"),
      listeners: logs.filter(l => l.event === "LISTENER_DETECTED")
    };

    res.json(summary);
  } catch {
    res.json({ status: "no data" });
  }
});

app.use(express.static("public"));

// app.listen DISABLED(PORT, () => {
  console.log("📡 OBSERVABILITY DASHBOARD RUNNING ON", PORT);
});
