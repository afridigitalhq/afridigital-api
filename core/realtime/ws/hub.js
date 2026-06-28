const WebSocket = require("ws");

let wss;

function initWS(server) {
  wss = new WebSocket.Server({ server });

  wss.on("connection", (ws, req) => {

    ws.channels = new Set();

    ws.on("message", (msg) => {
      try {
        const data = JSON.parse(msg);

        if (data.subscribe) {
          ws.channels.add(data.subscribe);
        }
      } catch (e) {}
    });

    ws.send(JSON.stringify({
      type: "SYSTEM",
      msg: "WS HUB CONNECTED"
    }));
  });

  return wss;
}

function broadcast(payload, channel = "events") {
  if (!wss) return;

  const msg = JSON.stringify({ channel, ...payload });

  wss.clients.forEach(client => {
    if (client.readyState === 1) {

      if (client.channels.size === 0 || client.channels.has(channel)) {
        client.send(msg);
      }

    }
  });
}

module.exports = { initWS, broadcast };
