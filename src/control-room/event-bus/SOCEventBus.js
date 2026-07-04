export class SOCEventBus {
  constructor() {
    this.listeners = new Map();
    this.queue = [];
    this.processing = false;
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

  emit(event, payload) {
    this.queue.push({ event, payload, timestamp: Date.now() });
    this._process();
  }

  async _process() {
    if (this.processing) return;
    this.processing = true;

    while (this.queue.length > 0) {
      const { event, payload } = this.queue.shift();

      const handlers = this.listeners.get(event);
      if (!handlers) continue;

      for (const handler of handlers) {
        try {
          await handler(payload);
        } catch (err) {
          this._emitError(event, err);
        }
      }
    }

    this.processing = false;
  }

  _emitError(sourceEvent, error) {
    const handlers = this.listeners.get("ERROR");
    if (!handlers) return;

    for (const h of handlers) {
      h({ sourceEvent, error, timestamp: Date.now() });
    }
  }

  clear() {
    this.listeners.clear();
    this.queue = [];
  }
}

export const socEventBus = new SOCEventBus();
