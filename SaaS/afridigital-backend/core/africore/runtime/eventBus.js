const { EventEmitter } = require("events");

class EventBus {
  constructor() {
    this.bus = new EventEmitter();
  }

  publish(event, payload) {
    this.bus.emit(event, payload);
  }

  subscribe(event, handler) {
    this.bus.on(event, handler);
  }
}

module.exports = new EventBus();
