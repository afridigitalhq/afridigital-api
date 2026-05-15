const WebSocket = require('ws');

class V8StreamBridge {

  constructor(server, traceBus, laneEngine) {
    this.wss = new WebSocket.Server({ server });

    this.traceBus = traceBus;
    this.laneEngine = laneEngine;

    this.clients = new Set();

    this.wss.on('connection', (ws) => {
      this.clients.add(ws);

      ws.on('close', () => this.clients.delete(ws));

      ws.send(JSON.stringify({
        type: 'SYSTEM',
        status: 'V8_STREAM_CONNECTED'
      }));
    });

    console.log('🚀 V8 STREAM BRIDGE INITIALIZED');
  }

  attach() {
    const original = this.traceBus.emit.bind(this.traceBus);

    this.traceBus.emit = (event) => {
      const trace = original(event);

      if (this.laneEngine) {
        trace.event.lane = this.laneEngine.assign(event);
      }

      this.broadcast(trace);

      return trace;
    };
  }

  broadcast(trace) {
    const payload = JSON.stringify({
      type: 'TRACE',
      data: trace
    });

    for (const client of this.clients) {
      if (client.readyState === 1) {
        client.send(payload);
      }
    }
  }
}

module.exports = V8StreamBridge;
