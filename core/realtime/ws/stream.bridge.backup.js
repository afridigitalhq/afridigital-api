const WebSocket = require("ws");

let wss;
let lastPayload = null;
let lastSent = 0;

function initWS(server) {
  wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    ws.send(JSON.stringify({ type: "system", msg: "connected" }));
  });

  return wss;
}

/**
 * 🚀 THROTTLED BROADCASTER
 * - prevents WS flooding
 * - sends only latest meaningful update
 * - enforces 30ms minimum interval
 */
function broadcast(payload) {
  if (!wss) return;

  const now = Date.now();

  lastPayload = payload;

  if (now - lastSent < 30) return; // throttle render pressure
  lastSent = now;

  const msg = JSON.stringify(lastPayload);

  wss.clients.forEach(c => {
    if (c.readyState === 1) {
      c.send(msg);
    }
  });
}

module.exports = {
  initWS,
  broadcast
};
