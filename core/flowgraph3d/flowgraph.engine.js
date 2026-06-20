class FlowGraphEngine {
  constructor() {
    this.nodes = new Map();
    this.edges = [];
  }

  ingest(event) {
    const id = event.traceId || "unknown";

    if (!this.nodes.has(id)) {
      this.nodes.set(id, { id, weight: 1 });
    } else {
      this.nodes.get(id).weight++;
    }

    this.edges.push({
      type: event.type,
      traceId: id,
      ts: Date.now()
    });
  }

  snapshot() {
    return {
      nodes: Array.from(this.nodes.values()),
      edges: this.edges.slice(-200)
    };
  }
}

module.exports = FlowGraphEngine;
