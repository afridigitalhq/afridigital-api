const EventEmitter = require('events');
const redisBus = require('../redis/bus');

class ClusterBridge extends EventEmitter {
  constructor() {
    super();
    this.clients = new Set();
  }

  attach(server) {
    const WebSocket = require('ws');
    this.wss = new WebSocket.Server({ server });

    this.wss.on('connection', (ws) => {
      this.clients.add(ws);
      ws.on('close', () => this.clients.delete(ws));
    });

    // 🧠 receive cluster events
    redisBus.init((event) => {
      this._broadcast(event);
    });
  }

  emitEvent(event) {
    const payload = {
      ...event,
      ts: Date.now(),
      node: process.env.NODE_ID || 'local'
    };

    // publish to cluster
    redisBus.publish(payload);

    // also broadcast locally
    this._broadcast(payload);
  }

  _broadcast(event) {
    const msg = JSON.stringify(event);

    for (const ws of this.clients) {
      if (ws.readyState === 1) ws.send(msg);
    }

    this.emit('broadcast', event);
  }
}

module.exports = new ClusterBridge();
