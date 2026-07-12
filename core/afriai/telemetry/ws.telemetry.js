const EventEmitter = require("events");

class WSTelemetry extends EventEmitter {
  constructor() {
    super();
    this.stats = {
      connections: 0,
      messages: 0,
      channels: {}
    };
  }

  onConnect() {
    this.stats.connections++;
    this.emit("update", this.stats);
  }

  onMessage(channel = "default") {
    this.stats.messages++;
    this.stats.channels[channel] = (this.stats.channels[channel] || 0) + 1;
    this.emit("update", this.stats);
  }

  snapshot() {
    return {
      ...this.stats,
      timestamp: Date.now()
    };
  }
}

module.exports = new WSTelemetry();
