class EventBus {
  constructor() {
    this.events = new Map();
  }

  on(event, handler) {
    if (!this.events.has(event)) this.events.set(event, []);
    this.events.get(event).push(handler);
  }

  emit(event, data) {
    const handlers = this.events.get(event) || [];
    handlers.forEach(fn => { try { fn(data); } catch (e) { console.log("Event error:", e.message); } });
  }

  list() {
    return Array.from(this.events.keys());
  }
}

export const eventBus = new EventBus();
