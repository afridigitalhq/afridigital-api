const WebSocket = require("ws");

let wss;

function initWS(server) {
  wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    ws.send(JSON.stringify({ type: "system", msg: "connected" }));
  });

  return wss;
}

function broadcast(payload) {
  if (!wss) return;

  const msg = JSON.stringify(payload);

  wss.clients.forEach(c => {
    if (c.readyState === 1) {
      c.send(msg);
    }
  });
}

module.exports = { initWS, broadcast };
