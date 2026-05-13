class LedgerCluster {
  constructor(nodeId) {
    this.nodeId = nodeId;
    this.nodes = new Set();
  }

  connect(node) {
    this.nodes.add(node);
  }

  broadcast(event) {
    for (const node of this.nodes) {
      node.receive(event);
    }
  }

  receive(event) {
    console.log(`[NODE ${this.nodeId}] replicated`, event.type);
  }
}

module.exports = LedgerCluster;
