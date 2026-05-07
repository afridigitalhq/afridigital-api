class EventBus {
  constructor() {
    this.listeners = {};
  }

  emit(event, payload = {}) {
    console.log(`\n📡 EVENT: ${event}`, payload);

    (this.listeners[event] || []).forEach(fn => fn(payload));
  }

  on(event, fn) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(fn);
  }
}

module.exports = new EventBus();
