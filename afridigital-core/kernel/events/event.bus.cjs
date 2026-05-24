/**
 * AfriDigital Event Bus - SINGLE SOURCE OF TRUTH
 * All services MUST use this only.
 */

class EventBus {
  constructor() {
    this.handlers = new Map();
  }

  on(event, fn) {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, []);
    }
    this.handlers.get(event).push(fn);
  }

  emit(event, data) {
    const handlers = this.handlers.get(event) || [];
    for (const fn of handlers) {
      try { fn(data); } catch (e) { console.error(e); }
    }
  }
}

module.exports = new EventBus();
