const WebSocket = require('ws');
const { subscribe } = require('../event/bus');

function attachSocket(server) {

  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {

    // subscribe this socket to event stream
    subscribe(ws);

    ws.send(JSON.stringify({
      type: "SYSTEM",
      message: "🟢 V8 STREAM CONNECTED"
    }));
  });

  console.log("🚀 SOCKET BRIDGE ACTIVE");
}

module.exports = { attachSocket };
