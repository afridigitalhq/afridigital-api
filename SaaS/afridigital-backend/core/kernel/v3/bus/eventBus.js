const EventEmitter = require('events');

class Bus extends EventEmitter {
  emitEvent(type, payload) {
    this.emit(type, payload);
  }

  onEvent(type, handler) {
    this.on(type, handler);
  }
}

module.exports = new Bus();
