const EventEmitter = require("events");

class ControlBus extends EventEmitter {
  constructor() {
    super();
    this.state = {
      ai: [],
      kernel: [],
      plugins: [],
      ws: [],
      anomalies: []
    };
  }

  emitEvent(type, payload) {
    const event = {
      type,
      payload,
      ts: Date.now()
    };

    // store in memory
    if (!this.state[type]) this.state[type] = [];
    this.state[type].push(event);

    // broadcast
    this.emit("event", event);
  }

  snapshot() {
    return {
      system: "AfriDigital Control Center",
      state: this.state,
      ts: Date.now()
    };
  }
}

module.exports = new ControlBus();
