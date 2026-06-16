const EventEmitter = require('events');
const redisBus = require('../redis/bus');
const stream = require('../redis/stream');

class StreamClusterBridge extends EventEmitter {
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

    // 🧠 consume cluster events
    redisBus.init((event) => {
      this._handle(event);
    });
  }

  async emitEvent(event) {
    const payload = {
      ...event,
      ts: Date.now(),
      node: process.env.NODE_ID || 'local'
    };

    // 1. live cluster broadcast
    redisBus.publish(payload);

    // 2. persistent stream log
    await stream.append(payload);

    // 3. local broadcast
    this._broadcast(payload);
  }

  _handle(event) {
    this._broadcast(event);
  }

  _broadcast(event) {
    const msg = JSON.stringify(event);

    for (const ws of this.clients) {
      if (ws.readyState === 1) ws.send(msg);
    }

    this.emit('broadcast', event);
  }

  async replayHistory(ws, limit = 50) {
    const history = await stream.replay();

    for (const item of history.slice(-limit)) {
      if (ws.readyState === 1) {
        ws.send(JSON.stringify({
          ...item.event,
          replay: true,
          streamId: item.id
        }));
      }
    }
  }
}

module.exports = new StreamClusterBridge();
