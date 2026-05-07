const EventEmitter = require("events");

class AfriBus extends EventEmitter {
  emitEvent(type, payload = {}) {
    const event = {
      type,
      payload,
      ts: new Date().toISOString()
    };

    console.log(`📡 EVENT => ${type}`);

    this.emit(type, event);
    this.emit("*", event);
  }
}

module.exports = new AfriBus();
