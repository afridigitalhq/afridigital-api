const { WebSocketServer } = require('ws');

class StreamBridgeV2 {

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

    // subscribe safely (NO injection)
    if (this.traceBus && this.traceBus.stream) {
      this.traceBus.stream.on('trace', (trace) => {
        this.broadcast({
          type: 'TRACE',
          payload: trace
        });
      });
    }

    console.log('⚡ STREAM BRIDGE v2 ACTIVE');
  }

  broadcast(data) {
    const msg = JSON.stringify(data);

    for (const client of this.clients) {
      if (client.readyState === 1) {
        client.send(msg);
      }
    }
  }
}

module.exports = StreamBridgeV2;
