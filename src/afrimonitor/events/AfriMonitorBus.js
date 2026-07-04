class AfriMonitorBus {
  constructor() {
    this.events = new Map();
  }

  on(event, fn) {
    if (!this.events.has(event)) this.events.set(event, new Set());
    this.events.get(event).add(fn);
    return () => this.off(event, fn);
  }

  off(event, fn) {
    this.events.get(event)?.delete(fn);
  }

  emit(event, data) {
    this.events.get(event)?.forEach(fn => fn(data));
  }

  clear() {
    this.events.clear();
  }
}

export const afriMonitorBus = new AfriMonitorBus();
