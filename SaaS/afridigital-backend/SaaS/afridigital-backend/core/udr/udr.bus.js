const EventEmitter = require('events');

class UDRBus extends EventEmitter {
  emitEvent(type, payload = {}) {
    const event = {
      id: Date.now() + '_' + Math.random().toString(36).slice(2),
      type,
      payload,
      ts: Date.now()
    };

    super.emit(type, event);
    super.emit('*', event);
    return event;
  }
}

module.exports = new UDRBus();
