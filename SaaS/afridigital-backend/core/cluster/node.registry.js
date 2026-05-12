const { assertApiVersion } = require("../runtime/safety/api.guard");
class NodeRegistry {
  constructor() {
    this.nodes = new Set();
  }

  register(nodeId) {
    this.nodes.add(nodeId);
  }

  all() {
    return Array.from(this.nodes);
  }

  size() {
    return this.nodes.size;
  }
}

module.exports = new NodeRegistry();
