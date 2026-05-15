/**
 * 🧠 A3.18.18 EVENT BUS CORE
 * Real runtime backbone for AfriAI
 */

const { EventEmitter } = require("events");

class EventBus extends EventEmitter {

  constructor() {
    super();
    this.setMaxListeners(100);
    this.history = [];
  }

  publish(event) {
    this.history.push(event);
    this.emit(event.type, event);
    this.emit("*", event); // global tap
    return event;
  }

  subscribe(type, handler) {
    this.on(type, handler);
  }

  getHistory() {
    return this.history;
  }
}

const bus = new EventBus();

module.exports = { bus };
