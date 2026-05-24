const EventEmitter = require("events");

class EventBus extends EventEmitter {
  publish(event, data) {
    console.log(`📡 EVENT PUBLISHED: ${event}`);
    this.emit(event, data);
  }
}

module.exports = new EventBus();
