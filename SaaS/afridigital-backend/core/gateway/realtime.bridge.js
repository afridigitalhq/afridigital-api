const stream = require("../stream/event.stream.log");

class RealtimeBridge {
  constructor(io) {
    this.io = io;

    stream.subscribe((event) => {
      this.io.emit("event:live", event);
    });
  }
}

module.exports = RealtimeBridge;
