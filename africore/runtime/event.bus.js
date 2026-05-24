const EventEmitter = require("events");
const swarm = require("./swarm.stream");

class AfriEventBus extends EventEmitter {

  emitEvent(type, payload, swarmMode = true) {
    this.emit(type, payload);

    if (swarmMode) {
      swarm.publish(type, payload);
    }
  }

  subscribe(type, handler) {
    this.on(type, handler);
  }
}

module.exports = new AfriEventBus();
