class EventBus {

  constructor() {
    this.listeners = {};
  }

  on(event, fn) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(fn);
  }

  emit(event, payload) {

    const handlers = this.listeners[event] || [];

    handlers.forEach(fn => fn(payload));
  }
}

module.exports = new EventBus();
