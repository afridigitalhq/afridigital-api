const WebSocket = require("ws");
const EventEmitter = require("events");

const bus = new EventEmitter();
const wss = new WebSocket.Server({ port: 9090 });

const nodes = {
  whatsapp: { status: "idle" },
  afriscan: { status: "scanner" },
  gateway: { status: "safe-exec" },
  system: { status: "runtime" }
};

function broadcast() {
  const payload = JSON.stringify({
    type: "graph",
    nodes,
    ts: Date.now()
  });

  wss.clients.forEach(c => {
    if (c.readyState === WebSocket.OPEN) c.send(payload);
  });
}

bus.on("event", (e) => {
  if (e.type === "whatsapp") nodes.whatsapp.status = "active";
  if (e.type === "scan") nodes.afriscan.status = "scanning";
  if (e.type === "command") nodes.gateway.status = "processing";

  broadcast();
});

module.exports = {
  bus,
  start: () => console.log("🧠 AFRISCAN GRAPH WS RUNNING ON 9090")
};
