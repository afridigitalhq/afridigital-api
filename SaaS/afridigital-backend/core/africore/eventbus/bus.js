const { EventEmitter } = require("events");

class EventBus extends EventEmitter {
  publish(event) {
    // async safe emit
    setImmediate(() => this.emit(event.type, event));
  }

  subscribe(type, handler) {
    this.on(type, async (event) => {
      try {
        await handler(event);
      } catch (e) {
        console.log("EventBus error:", e.message);
      }
    });
  }
}

module.exports = new EventBus();
