const EventEmitter = require('events');

class ControlBus extends EventEmitter {
  emitEvent(event) {
    this.emit("control.event", {
      ...event,
      ts: Date.now()
    });
  }

  stream(handler) {
    this.on("control.event", handler);
  }
}

module.exports = new ControlBus();
