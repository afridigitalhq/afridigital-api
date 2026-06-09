const obs = require('../v1_4');

class TraceGraph {
  constructor() {
    this.nodes = [];
    this.edges = [];
  }

  addNode(traceId, type, meta = {}) {
    this.nodes.push({ traceId, type, meta, ts: Date.now() });
  }

  addEdge(from, to, relation) {
    this.edges.push({ from, to, relation, ts: Date.now() });
  }

  buildTrace(traceId) {
    return {
      traceId,
      nodes: this.nodes.filter(n => n.traceId === traceId),
      edges: this.edges.filter(e =>
        e.from.includes(traceId) || e.to.includes(traceId)
      )
    };
  }
}

module.exports = new TraceGraph();
