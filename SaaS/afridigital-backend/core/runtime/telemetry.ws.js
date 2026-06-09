const WebSocket = require("ws");

function attachWebSocket(server, bus) {
  const wss = new WebSocket.Server({ server });

  bus.on("telemetry", (data) => {
    wss.clients.forEach(client => {
      if (client.readyState === 1) {
        client.send(JSON.stringify(data));
      }
    });
  });

  console.log("🌐 AFRISCAN WS CONTROL TOWER ACTIVE");
}

module.exports = attachWebSocket;
