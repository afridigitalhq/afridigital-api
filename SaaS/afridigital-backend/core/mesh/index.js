const EventEmitter = require("events");
const bus = require("../events/bus");
const memory = require("../memory/engine");

class MeshNode extends EventEmitter {
  constructor(name) {
    super();
    this.name = name;
    this.peers = new Set();
  }

  connect(node) {
    this.peers.add(node);
    return this;
  }

  emitEvent(type, payload) {
    // local emit
    this.emit(type, payload);

    // bus emit (local system)
    bus.publish(type, { from: this.name, payload });

    // propagate to peers
    for (const peer of this.peers) {
      peer.receive(type, payload, this.name);
    }
  }

  receive(type, payload, from) {
    this.emit(type, { ...payload, from });
  }

  async persist(key, value) {
    return memory.set(key, value);
  }

  async recall(key) {
    return memory.get(key);
  }
}

function createMesh(name="node") {
  return new MeshNode(name);
}

module.exports = { createMesh };
