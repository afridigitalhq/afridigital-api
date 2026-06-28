// AFRIKERNEL_GOVERNED_RUNTIME: ALL EXECUTION MUST FLOW VIA SYSCALLGATE

/**
 * OBSERVABILITY GRAPH NEURAL INDEX
 * Causal relationship mapping engine
 */

class CausalityGraph {
  constructor() {
    this.nodes = new Map();
    this.edges = [];
  }

  ingest(event) {
    const id = event.id || Date.now();

    this.nodes.set(id, {
      type: event.type,
      ts: event.ts || Date.now()
    });

    if (event.causedBy) {
      this.edges.push({
        from: event.causedBy,
        to: id
      });
    }

    return this._analyze();
  }

  _analyze() {
    return {
      nodes: this.nodes.size,
      edges: this.edges.length,
      density: this.edges.length / Math.max(this.nodes.size, 1)
    };
  }

  trace(id) {
    return this.edges.filter(e => e.to === id);
  }
}

module.exports = { CausalityGraph };
