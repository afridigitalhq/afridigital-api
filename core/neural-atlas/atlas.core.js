class NeuralAtlas {
  constructor() {
    this.nodes = new Map();
    this.edges = new Map();
    this.timeline = [];
  }

  registerNode(id, meta = {}) {
    if (!this.nodes.has(id)) {
      this.nodes.set(id, { id, weight: 1, activity: 0, meta });
    }
  }

  registerFlow(from, to, success = true, traceId = null) {
    this.registerNode(from);
    this.registerNode(to);

    const key = from + "->" + to;

    const edge = this.edges.get(key) || {
      from,
      to,
      hits: 0,
      success: 0,
      fail: 0
    };

    edge.hits++;
    success ? edge.success++ : edge.fail++;

    this.edges.set(key, edge);

    this.timeline.push({
      ts: Date.now(),
      traceId,
      from,
      to,
      success
    });
  }

  getGraph() {
    return {
      nodes: Array.from(this.nodes.values()),
      edges: Array.from(this.edges.values()),
      timeline: this.timeline.length
    };
  }
}

module.exports = new NeuralAtlas();
