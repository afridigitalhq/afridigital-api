class EventBus {
  constructor() {
    this.handlers = {};
  }

  on(event, handler) {
    if (!this.handlers[event]) this.handlers[event] = [];
    this.handlers[event].push(handler);
  }

  async emit(event, payload) {
    const list = this.handlers[event] || [];
    for (const handler of list) {
      try {
        await handler(payload);
      } catch (e) {
        console.log("❌ EventBus error:", e.message);
      }
    }
  }
}

module.exports = new EventBus();
