const EventEmitter = require("events");

class Mesh extends EventEmitter {
  send(from, to, payload) {
    this.emit(`msg:${to}`, { from, payload });
  }

  listen(id, handler) {
    this.on(`msg:${id}`, handler);
  }
}

module.exports = new Mesh();
