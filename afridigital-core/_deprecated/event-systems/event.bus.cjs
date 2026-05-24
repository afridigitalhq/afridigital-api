const EventEmitter = require("events");

const bus = new EventEmitter();

bus.emitEvent = (type, payload) => {
  bus.emit(type, {
    timestamp: Date.now(),
    type,
    payload
  });
};

module.exports = bus;
