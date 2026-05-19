const WebSocket = require('ws');

class V8StreamBridge {

  constructor(server, traceBus) {
    this.wss = new WebSocket.Server({ server });
    this.traceBus = traceBus;

    this.clients = new Set();

    this.wss.on('connection', (ws) => {
      this.clients.add(ws);

      ws.on('close', () => this.clients.delete(ws));

      ws.send(JSON.stringify({
        type: 'SYSTEM',
        message: 'V8 STREAM CONNECTED'
      }));
    });

    console.log('🚀 V8 STREAM BRIDGE ACTIVE');
  }

  broadcast(trace) {
    const payload = JSON.stringify({
      type: 'TRACE',
      data: trace
    });

    for (const ws of this.clients) {
      if (ws.readyState === 1) {
        ws.send(payload);
      }
    }
  }

  hook() {
    const originalEmit = this.traceBus.emit.bind(this.traceBus);

    this.traceBus.emit = (event) => {
      const trace = originalEmit(event);

      if (global.laneEngine) {
        trace.event.lane = global.laneEngine.assign(trace.event);
      }

      this.broadcast(trace);

      return trace;
    };
  }
}

module.exports = V8StreamBridge;
