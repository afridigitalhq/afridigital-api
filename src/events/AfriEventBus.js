export class AfriEventBus {
  constructor() {
    this.listeners = new Map();
  }

  on(event, handler) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(handler);
  }

  emit(event, data) {
    const handlers = this.listeners.get(event);
    if (!handlers) return;

    for (const h of handlers) {
      try {
        h(data);
      } catch (e) {
        console.log("⚠️ Event handler error:", e.message);
      }
    }
  }

  off(event, handler) {
    const set = this.listeners.get(event);
    if (set) set.delete(handler);
  }
}

export const GlobalEventBus = new AfriEventBus();
