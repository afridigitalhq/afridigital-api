class EventBus {
  constructor() {
    this.channels = {};
  }

  on(event, fn) {
    if (!this.channels[event]) this.channels[event] = [];
    this.channels[event].push(fn);
  }

  emit(event, data) {
    (this.channels[event] || []).forEach(fn => fn(data));
  }
}

export const bus = new EventBus();
