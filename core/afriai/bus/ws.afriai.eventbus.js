const EventEmitter = require("events");

class AfriAIEventBus extends EventEmitter {
  constructor() {
    super();
    this.buffer = [];
  }

  emitEvent(type, payload) {
    const event = {
      type,
      payload,
      ts: Date.now()
    };

    this.buffer.push(event);
    this.emit(type, event);
    this.emit("*", event);

    return event;
  }

  getBuffer() {
    return this.buffer.slice(-200);
  }
}

module.exports = new AfriAIEventBus();
