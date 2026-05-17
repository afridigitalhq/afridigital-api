const bus = require("./event.bus");
const { log } = require("./ledger");

bus.onAny = function(type, payload) {
  log({ type, payload });
};

const originalEmit = bus.emit;

bus.emit = function(type, payload) {
  log({ type, payload });
  return originalEmit.call(bus, type, payload);
};

module.exports = bus;
