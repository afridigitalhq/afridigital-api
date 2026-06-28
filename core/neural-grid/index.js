const { broadcast } = require("../realtime/flowgraph-ws");

class NeuralGrid {
  constructor() {
    this.nodes = new Map();
    this.edges = new Map();
  }

  pulse(event) {
    const node = this.nodes.get(event.service) || {
      id: event.service,
      health: 1,
      load: 0,
      status: "UNKNOWN"
    };

    // update neural state
    if (event.status === "FAIL") node.health -= 0.1;
    if (event.status === "OK") node.health = Math.min(1, node.health + 0.02);

    node.lastEvent = event;
    this.nodes.set(event.service, node);

    broadcast({
      type: "NEURAL_PULSE",
      node,
      timestamp: Date.now()
    });
  }

  snapshot() {
    return {
      nodes: Array.from(this.nodes.values()),
      edges: Array.from(this.edges.entries())
    };
  }
}

module.exports = new NeuralGrid();
