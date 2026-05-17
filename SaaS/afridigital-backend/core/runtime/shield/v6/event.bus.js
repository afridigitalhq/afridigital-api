const EventEmitter = require("events");

class RuntimeBus extends EventEmitter {
  emitEvent(type, payload) {
    this.emit(type, {
      ...payload,
      ts: Date.now()
    });
  }
}

module.exports = new RuntimeBus();
