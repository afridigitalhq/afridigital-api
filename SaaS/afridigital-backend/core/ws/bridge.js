const EventEmitter = require('events');

class WSBridge extends EventEmitter {
  constructor() {
    super();
    this.clients = new Set();
    this.buffer = [];
    this.maxBuffer = 500; // replay window
  }

  attach(server) {
    const WebSocket = require('ws');
    this.wss = new WebSocket.Server({ server });

    this.wss.on('connection', (ws) => {
      this.clients.add(ws);

      // 🔁 replay last state on reconnect
      for (const event of this.buffer) {
        if (ws.readyState === 1) ws.send(JSON.stringify({
          ...event,
          replay: true
        }));
      }

      ws.on('close', () => this.clients.delete(ws));
    });
  }

  emitEvent(event) {
    const payload = {
      ...event,
      ts: Date.now()
    };

    // 🧠 store in buffer (replay memory)
    this.buffer.push(payload);
    if (this.buffer.length > this.maxBuffer) {
      this.buffer.shift();
    }

    const msg = JSON.stringify(payload);

    // 📡 broadcast to all clients
    for (const ws of this.clients) {
      if (ws.readyState === 1) ws.send(msg);
    }

    // 🔁 emit internally for other subsystems
    this.emit('broadcast', payload);
  }
}

module.exports = new WSBridge();
