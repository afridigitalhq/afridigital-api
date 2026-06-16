class ExecutionGraph {
  constructor() {
    this.nodes = new Map();
    this.edges = [];
  }

  add(node, next) {
    if (!this.nodes.has(node)) this.nodes.set(node, []);
    if (next) this.nodes.get(node).push(next);
    this.edges.push({ node, next });
  }

  trace(node) {
    return this.nodes.get(node) || [];
  }
}

module.exports = { ExecutionGraph };
