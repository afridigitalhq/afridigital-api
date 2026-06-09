const EventEmitter = require("events");
const stream = new EventEmitter();

module.exports = {
  emit: (type, payload) => stream.emit("event", { type, payload, ts: Date.now() }),
  on: (fn) => stream.on("event", fn)
};
