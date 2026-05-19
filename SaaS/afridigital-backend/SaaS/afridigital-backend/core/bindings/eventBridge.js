/**
 * A3.1 EVENT BRIDGE (BACKEND → FRONTEND LIVE SYNC)
 * Connects V8 event bus to WebSocket stream layer
 */

const { publish, subscribe } = require('../event/bus');

function attachEventBridge(wss) {

  // subscribe WebSocket clients to event bus
  wss.on('connection', (ws) => {

    subscribe(ws);

    ws.send(JSON.stringify({
      type: "SYSTEM_BOOT",
      message: "🟢 A3 EVENT BRIDGE ACTIVE"
    }));

  });

  console.log("🚀 A3.1 EVENT BRIDGE ONLINE");
}

module.exports = { attachEventBridge };
