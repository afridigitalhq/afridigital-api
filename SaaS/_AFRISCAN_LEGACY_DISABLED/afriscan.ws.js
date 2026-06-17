/**
 * 📡 AFRISCAN CONTROL TOWER WS SERVER
 * Streams all system + WhatsApp events
 */

const WebSocket = require("ws");
const { on } = require("../runtime/eventbus/afriscan.bus");

const PORT = process.env.AFRISCAN_WS_PORT || 9090;

const wss = new WebSocket.Server({ port: PORT });

wss.on("connection", (ws) => {
  console.log("🧠 CONTROL TOWER CLIENT CONNECTED");

  ws.send(JSON.stringify({
    type: "system",
    status: "connected",
    ts: Date.now()
  }));
});

// 🔁 STREAM ALL EVENTS TO FRONTEND
on((packet) => {
  const msg = JSON.stringify(packet);

  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(msg);
    }
  });
});

console.log("📡 AFRISCAN WS CONTROL TOWER ON PORT", PORT);

module.exports = { wss };
