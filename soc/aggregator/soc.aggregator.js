class SOCAggregator {
  constructor() {
    this.events = [];
  }

  ingest(event) {
    this.events.push(event);
    if (this.events.length > 5000) this.events.shift();
  }

  snapshot() {
    const nodes = {};
    const edges = {};

    for (const e of this.events) {
      const n = e.source || "unknown";
      nodes[n] = (nodes[n] || 0) + 1;

      const t = e.target || "unknown";
      const key = `${n}->${t}`;
      edges[key] = (edges[key] || 0) + 1;
    }

    return {
      graph: {
        nodes: Object.entries(nodes).map(([id, weight]) => ({ id, weight })),
        edges: Object.entries(edges).map(([k, weight]) => {
          const [source, target] = k.split("->");
          return { source, target, weight };
        })
      },
      heatmap: nodes,
      replaySize: this.events.length,
      anomalies: []
    };
  }
}

module.exports = { SOCAggregator };
