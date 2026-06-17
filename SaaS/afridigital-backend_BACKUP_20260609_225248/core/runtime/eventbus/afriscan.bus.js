/**
 * 🧠 AFRISCAN EVENT BUS
 * Central stream for all system events
 */

const EventEmitter = require("events");
const bus = new EventEmitter();

function emit(event, payload) {
  const packet = {
    event,
    payload,
    ts: Date.now()
  };

  bus.emit("afriscan:event", packet);
  return packet;
}

function on(handler) {
  bus.on("afriscan:event", handler);
}

module.exports = {
  emit,
  on
};
