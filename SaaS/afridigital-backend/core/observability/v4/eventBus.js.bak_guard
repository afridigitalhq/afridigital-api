const EventEmitter = require("events");

class ObservabilityBus extends EventEmitter {
  emitEvent(type, payload = {}) {
    this.emit(type, {
      ...payload,
      timestamp: Date.now()
    });
  }
}

module.exports = new ObservabilityBus();
