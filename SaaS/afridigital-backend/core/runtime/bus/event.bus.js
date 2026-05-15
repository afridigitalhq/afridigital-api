/**
 * 🧠 A3.18.28 MASTER EVENT BUS (SINGLE SOURCE OF TRUTH)
 */

class EventBus {
  constructor() {
    this.listeners = {};
  }

  subscribe(event, fn) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(fn);
  }

  publish(event) {
    const type = event.type;
    const list = this.listeners[type] || [];

    for (const fn of list) {
      fn(event);
    }
  }
}

const bus = new EventBus();

module.exports = { bus };
