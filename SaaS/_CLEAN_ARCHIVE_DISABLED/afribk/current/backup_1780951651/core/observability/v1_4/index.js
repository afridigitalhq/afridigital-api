const EventEmitter = require('events');

class ObservabilityCore extends EventEmitter {
  constructor() {
    super();
    this.state = {
      health: { ok: true },
      ready: false,
      metrics: {
        requests: 0,
        errors: 0,
        latency: []
      },
      traces: []
    };
  }

  track(event, payload = {}) {
    this.state.traces.push({
      event,
      payload,
      ts: Date.now()
    });

    this.emit(event, payload);
  }

  incRequest() {
    this.state.metrics.requests++;
  }

  incError() {
    this.state.metrics.errors++;
  }

  recordLatency(ms) {
    this.state.metrics.latency.push(ms);
    if (this.state.metrics.latency.length > 100) {
      this.state.metrics.latency.shift();
    }
  }

  snapshot() {
    return this.state;
  }
}

module.exports = new ObservabilityCore();
