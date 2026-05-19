const EventEmitter = require('events');

/**
 * 🚀 GLOBAL BUS LOCK (AFRIDIGITAL SAFE MODE)
 * Single source of truth event system
 */

class GlobalBus extends EventEmitter {
  publish(event) {
    if (!event || !event.type) return;
    this.emit(event.type, event);
  }

  subscribe(type, handler) {
    this.on(type, handler);
  }
}

const bus = new GlobalBus();

module.exports = { bus };
