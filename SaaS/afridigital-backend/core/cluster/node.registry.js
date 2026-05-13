class NodeRegistry {
  constructor() {
    this.nodes = new Map(); // nodeId -> metadata
  }

  register(node) {
    this.nodes.set(node.id, {
      ...node,
      lastSeen: Date.now()
    });
  }

  list() {
    return Array.from(this.nodes.values());
  }

  getHealthyNodes() {
    return this.list().filter(n => n.status === "healthy");
  }
}

module.exports = new NodeRegistry();
