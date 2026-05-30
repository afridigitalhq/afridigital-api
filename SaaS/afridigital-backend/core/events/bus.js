const EventEmitter = require("events");

/**
 * 🧠 Unified in-memory event bus (Redis optional)
 * Works in:
 * - Render (no Redis)
 * - Local (Redis enabled)
 */

class Bus extends EventEmitter {
  publish(event, data) {
    this.emit(event, data);
    return true;
  }

  subscribe(event, handler) {
    this.on(event, handler);
    return () => this.off(event, handler);
  }
}

const bus = new Bus();

// optional memory mirror for debugging
const memoryLog = [];

bus.onAny = function(event, data) {
  memoryLog.push({ event, data, ts: Date.now() });
};

module.exports = {
  publish: bus.publish.bind(bus),
  subscribe: bus.subscribe.bind(bus),
  bus,
  memoryLog
};
