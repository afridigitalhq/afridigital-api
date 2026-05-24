const WebSocket = require("ws");
const { on } = require("./realtime.event.bus.cjs");

function startRealtimeServer(server) {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {

    ws.send(JSON.stringify({
      type: "system",
      message: "Connected to AfriRealtime OS"
    }));

    const send = (event) => {
      ws.send(JSON.stringify(event));
    };

    on("billing:event", send);
    on("revenue:update", send);
    on("tenant:activity", send);

  });

  console.log("📡 Realtime WS Server running");
}

module.exports = { startRealtimeServer };
