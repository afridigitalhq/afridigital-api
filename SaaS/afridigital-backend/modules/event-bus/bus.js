const EventEmitter = require('events');
class Bus extends EventEmitter {
  emitEvent(type, payload) {
    this.emit(type, { type, payload, timestamp: Date.now() });
  }
}
module.exports = new Bus();
