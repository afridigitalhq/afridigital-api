const WebSocket = require("ws");

let wss;

/**
 * Attach WS server
 */
function attach(server) {
  wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    ws.send(JSON.stringify({
      type: "connected",
      message: "DAG realtime channel active"
    }));
  });
}

/**
 * Broadcast DAG event
 */
function broadcast(event, data) {
  if (!wss) return;

  const payload = JSON.stringify({ event, data });

  wss.clients.forEach(client => {
    if (client.readyState === 1) {
      client.send(payload);
    }
  });
}

module.exports = {
  attach,
  broadcast
};
