const WebSocket = require("ws");
const bus = require("../core/eventBus"); // adjust if needed

let clients = [];

function init(server) {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    clients.push(ws);

    ws.on("close", () => {
      clients = clients.filter(c => c !== ws);
    });
  });

  bus.on("WALLET_UPDATED", (data) => {
    broadcast({ type: "WALLET_UPDATED", data });
  });

  bus.on("NOTIFICATION_CREATED", (data) => {
    broadcast({ type: "NOTIFICATION_CREATED", data });
  });

  bus.on("ACTIVITY_LOGGED", (data) => {
    broadcast({ type: "ACTIVITY_LOGGED", data });
  });

  function broadcast(msg) {
    const payload = JSON.stringify(msg);
    clients.forEach(c => {
      if (c.readyState === 1) c.send(payload);
    });
  }

  return wss;
}

module.exports = { init };
