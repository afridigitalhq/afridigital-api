const WebSocket = require("ws");
const { publish, subscribe } = require("../runtime/bus/event.bus");

/**
 * A3.3 WS GATEWAY (REAL EVENT PIPE)
 * Bridges V8 event bus → frontend stream
 */

function attachGateway(server) {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {

    // subscribe client to event bus
    subscribe(ws);

    // initial handshake
    ws.send(JSON.stringify({
      type: "SYSTEM",
      state: "A3.3_STREAM_CONNECTED"
    }));

    // optional ping keepalive
    const interval = setInterval(() => {
      ws.send(JSON.stringify({
        type: "HEARTBEAT",
        ts: Date.now()
      }));
    }, 15000);

    ws.on("close", () => clearInterval(interval));
  });

  console.log("🚀 A3.3 WS GATEWAY ACTIVE");
}

module.exports = { attachGateway };
