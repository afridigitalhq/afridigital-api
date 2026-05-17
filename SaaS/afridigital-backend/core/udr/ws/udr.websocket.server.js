const WebSocket = require('ws');
const bus = require('../udr/udr.bus');

console.log('📡 UDR WEBSOCKET SERVER INITIALIZING');

function createUDRWebSocket(server) {
  const wss = new WebSocket.Server({
    server,
    path: '/udr'
  });

  const clients = new Set();

  wss.on('connection', (ws) => {
    console.log('🔌 UDR CLIENT CONNECTED');
    clients.add(ws);

    ws.send(JSON.stringify({
      type: 'welcome',
      module: 'udr',
      status: 'online',
      ts: Date.now()
    }));

    ws.on('close', () => {
      clients.delete(ws);
      console.log('❌ UDR CLIENT DISCONNECTED');
    });
  });

  // Broadcast from UDR bus → WebSocket clients
  bus.on('fusion.event', (event) => {
    const payload = JSON.stringify({
      type: 'fusion.event',
      data: event
    });

    for (const client of clients) {
      if (client.readyState === 1) {
        client.send(payload);
      }
    }
  });

  bus.on('system.heartbeat', (event) => {
    const payload = JSON.stringify({
      type: 'heartbeat',
      data: event
    });

    for (const client of clients) {
      if (client.readyState === 1) {
        client.send(payload);
      }
    }
  });

  console.log('🚀 UDR WEBSOCKET READY ON /udr');

  return wss;
}

module.exports = { createUDRWebSocket };
