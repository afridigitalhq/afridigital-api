const WebSocket = require('ws');
const bus = require('../redis/bus');
const stream = require('../redis/stream');

class ClusterTimeEngine {
  constructor() {
    this.clients = new Set();
  }

  attach(server) {
    this.wss = new WebSocket.Server({ server });

    this.wss.on('connection', (ws) => {
      this.clients.add(ws);
      ws.on('close', () => this.clients.delete(ws));
    });

    bus.init((event) => this.broadcast(event));
  }

  async emit(event) {
    const payload = { ...event, ts: Date.now(), node: process.env.NODE_ID || 'local' };

    bus.publish(payload);
    await stream.append(payload);
    this.broadcast(payload);
  }

  async replayTo(ws, limit = 50) {
    const history = await stream.replay(limit);
    for (const item of history) {
      ws.send(JSON.stringify({ ...item.event, replay: true }));
    }
  }

  broadcast(event) {
    const msg = JSON.stringify(event);
    for (const ws of this.clients) {
      if (ws.readyState === 1) ws.send(msg);
    }
  }
}

module.exports = new ClusterTimeEngine();
