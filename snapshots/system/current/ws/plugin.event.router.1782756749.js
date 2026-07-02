const EventEmitter = require("events");

class PluginEventRouter extends EventEmitter {
  constructor() {
    super();
    this.events = [];
  }

  dispatch(source, target, type, payload = {}) {
    const event = {
      source,
      target,
      type,
      payload,
      ts: Date.now()
    };

    this.events.push(event);

    this.emit(target, event);
    this.emit("EVENT", event);

    return event;
  }

  history() {
    return [...this.events];
  }

  clear() {
    this.events = [];
  }

  count() {
    return this.events.length;
  }
}

module.exports = new PluginEventRouter();
