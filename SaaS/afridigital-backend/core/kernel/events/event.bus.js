const EventEmitter = require("events");

class AfriEventBus extends EventEmitter {
  emitEvent(type, payload) {
    return this.emit(type, {
      timestamp: Date.now(),
      type,
      payload
    });
  }

  onEvent(type, handler) {
    this.on(type, handler);
  }
}

module.exports = new AfriEventBus();


