const WebSocket = require('ws');
const bus = require('./udr.bus');
const { listModules } = require('./module.registry');

const wss = new WebSocket.Server({ port: 7072 });

console.log('📡 UDR LIVE STREAM ON :7072');

function broadcast(data) {
  const msg = JSON.stringify(data);
  wss.clients.forEach(c => {
    if (c.readyState === 1) c.send(msg);
  });
}

// send initial state
wss.on('connection', ws => {
  ws.send(JSON.stringify({
    type: 'init',
    modules: listModules()
  }));
});

// stream all events
bus.on('*', (event) => {
  broadcast(event);
});
