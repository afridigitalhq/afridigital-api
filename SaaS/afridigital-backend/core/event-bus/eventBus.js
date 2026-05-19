const EventEmitter = require("events");
const bus = new EventEmitter();

function emit(event, payload) {
  console.log("📡 DISPATCH EVENT:", event, payload);

  console.log("📡 EVENT:", event);
  bus.emit(event, payload);
}

function on(event, handler) {
  bus.on(event, handler);
}

module.exports = { emit, on };
