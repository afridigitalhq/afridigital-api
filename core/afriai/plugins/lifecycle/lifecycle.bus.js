const EventEmitter = require("events");

class LifecycleBus extends EventEmitter {
  constructor() {
    super();
    this.events = [];
  }

  publish(event) {
    const record = {
      ...event,
      ts: Date.now()
    };

    this.events.push(record);
    this.emit("lifecycle", record);

    return record;
  }

  history() {
    return [...this.events];
  }

  clear() {
    this.events = [];
  }
}

module.exports = new LifecycleBus();
