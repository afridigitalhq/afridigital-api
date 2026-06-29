class CausalGraph {
  constructor() {
    this.nodes = new Map();
    this.edges = [];
  }

  link(parent, child) {
    this.edges.push({ parent, child, time: Date.now() });
  }

  snapshot() {
    return {
      nodes: Array.from(this.nodes.keys()),
      edges: this.edges
    };
  }
}

module.exports = { CausalGraph };
