const hub = require("./hub");

function emitTrace(event) {
  hub.broadcast({
    type: "trace",
    time: Date.now(),
    payload: event
  });
}

module.exports = { emitTrace };
