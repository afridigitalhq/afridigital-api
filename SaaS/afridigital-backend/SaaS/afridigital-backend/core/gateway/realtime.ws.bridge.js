const hub = require("../realtime/event.hub");

class RealtimeBridge {
  constructor(io) {
    this.io = io;
    hub.on("event", (event) => {
      this.io.emit("event:live", event);
    });
  }
}

module.exports = RealtimeBridge;
