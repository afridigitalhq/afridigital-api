const WebSocket = require('ws');
const { subscribe } = require('./bus');

function attach(server) {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    console.log('⚡ UI CLIENT CONNECTED');
    subscribe(ws);

    ws.send(JSON.stringify({
      type: 'system',
      status: 'connected'
    }));
  });

  console.log('🚀 SOCKET BRIDGE ACTIVE');
}

module.exports = { attach };
