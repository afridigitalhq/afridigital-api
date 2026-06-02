const EventEmitter = require("events");

class AdminStream extends EventEmitter {}

const stream = new AdminStream();

/**
 * emit system events
 */
function emitAdminEvent(type, payload) {
  stream.emit("event", {
    type,
    payload,
    timestamp: Date.now()
  });
}

module.exports = {
  stream,
  emitAdminEvent
};
