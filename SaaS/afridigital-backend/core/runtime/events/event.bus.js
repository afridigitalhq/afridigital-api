const EventEmitter = require('events');
class Bus extends EventEmitter {
  emitEvent(type, payload={}) {
    const event = { type, payload, ts: Date.now() };
    super.emit(type, event);
    super.emit('*', event);
    return event;
  }
}
module.exports = new Bus();
