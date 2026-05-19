class ReplicationBus {
  constructor(nodes) {
    this.nodes = nodes;
  }

  broadcast(event) {
    for (const node of this.nodes) {
      node.handle(event);
    }
  }
}

module.exports = ReplicationBus;
