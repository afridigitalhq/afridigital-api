class DAGTracer {
  constructor() {
    this.graph = [];
  }

  trace(from, to, meta = {}) {
    this.graph.push({
      from,
      to,
      meta,
      ts: Date.now()
    });
  }

  get() {
    return this.graph;
  }
}

module.exports = { DAGTracer };
