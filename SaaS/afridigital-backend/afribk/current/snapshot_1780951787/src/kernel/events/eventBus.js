class EventBus {
  constructor() {
    this.events = {};
  }

  on(event, fn) {
    this.events[event] = this.events[event] || [];
    this.events[event].push(fn);
  }

  emit(event, data) {
    (this.events[event] || []).forEach(fn => fn(data));
  }
}

module.exports = new EventBus();
