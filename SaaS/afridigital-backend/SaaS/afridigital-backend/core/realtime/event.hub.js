const EventEmitter = require("events");

class EventHub extends EventEmitter {
  emitEvent(event) {
    this.emit("event", event);
  }
}

module.exports = new EventHub();
