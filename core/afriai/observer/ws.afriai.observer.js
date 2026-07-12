const EventEmitter = require("events");

class AfriAIObserver extends EventEmitter {
  constructor() {
    super();
    this.buffer = [];
    this.metrics = {
      messages: 0,
      connections: 0,
      errors: 0
    };
  }

  ingest(event) {
    this.buffer.push(event);
    this.metrics.messages++;

    if (this.buffer.length > 100) {
      this.buffer.shift(); // keep memory bounded
    }

    this.emit("stream", {
      type: "AFRIAI_WS_EVENT",
      event,
      metrics: this.metrics,
      ts: Date.now()
    });
  }

  connect() {
    this.metrics.connections++;
  }

  error(err) {
    this.metrics.errors++;
    this.emit("error", err);
  }

  snapshot() {
    return {
      metrics: this.metrics,
      bufferSize: this.buffer.length
    };
  }
}

module.exports = new AfriAIObserver();
