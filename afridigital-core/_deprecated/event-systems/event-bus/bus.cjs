const bus = {
  queue: [],
  handlers: {},

  on(event, fn) {
    this.handlers[event] = this.handlers[event] || [];
    this.handlers[event].push(fn);
  },

  emit(event, payload = {}) {
    console.log("📡 EVENT:", event, payload);

    this.queue.push({ event, payload, ts: Date.now() });

    const handlers = this.handlers[event] || [];
    for (const fn of handlers) fn(payload);
  }
};

module.exports = bus;
