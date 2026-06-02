const EventEmitter = require("events");

/**
 * 🧠 CORE EVENT BUS (STABLE BASE LAYER)
 * This is the single source of truth for all system signals
 */

class Bus extends EventEmitter {
  emitEvent(type, payload = {}, swarmMode = true) {
    this.emit(type, payload);

    // optional debug stream
    if (swarmMode) {
      this.emit("DEBUG", { type, payload });
    }
  }
}

const bus = new Bus();

module.exports = bus;
