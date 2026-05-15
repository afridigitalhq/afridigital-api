const { WebSocketServer } = require('ws');

class StreamBridge {

  constructor(server, traceBus) {
    this.wss = new WebSocketServer({ server });
    this.traceBus = traceBus;

    this.clients = new Set();

    this.wss.on('connection', (ws) => {
      this.clients.add(ws);

      ws.on('close', () => {
        this.clients.delete(ws);
      });
    });

    // subscribe to trace stream if available
    if (traceBus.stream) {
      traceBus.stream.on('trace', (trace) => {
        this.broadcast(trace);
      });
    }

    console.log('⚡ STREAM BRIDGE ACTIVE');
  }

  broadcast(data) {
    const payload = JSON.stringify(data);

    for (const client of this.clients) {
      if (client.readyState === 1) {
        client.send(payload);
      }
    }
  }
}

module.exports = StreamBridge;
