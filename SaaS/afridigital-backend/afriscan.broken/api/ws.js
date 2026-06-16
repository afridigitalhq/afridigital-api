const WebSocket = require("ws");
const collect = require("../truth/collector");
const scoreFn = require("../utils/score");

const wss = new WebSocket.Server({ port: 5051 });

function broadcast(data) {
  const payload = JSON.stringify(data);

  wss.clients.forEach(client => {
    if (client.readyState === 1) {
      client.send(payload);
    }
  });
}

function tick() {
  const truth = collect();
  const scored = scoreFn(truth);

  const snapshot = {
    timestamp: new Date().toISOString(),
    score: scored.score,
    breakdown: scored.breakdown,
    truth
  };

  broadcast(snapshot);
}

// live loop
setInterval(tick, 2000);

console.log("📡 AfriScan WebSocket running on :5051");
