export class EventBus {
  constructor() {
    this.listeners = new Map();
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
  }

  off(event, callback) {
    this.listeners.get(event)?.delete(callback);
  }

  emit(event, payload = {}) {
    const subs = this.listeners.get(event);
    if (!subs) return;

    for (const cb of subs) {
      try {
        cb(payload);
      } catch (err) {
        console.error("EventBus error:", err);
      }
    }
  }

  clear(event) {
    if (event) this.listeners.delete(event);
    else this.listeners.clear();
  }
}

export const eventBus = new EventBus();
