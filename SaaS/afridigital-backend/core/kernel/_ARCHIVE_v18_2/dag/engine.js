class ExecutionDAG {
  constructor() {
    this.nodes = new Map();
  }

  addEdge(from, to) {
    if (!this.nodes.has(from)) this.nodes.set(from, []);
    this.nodes.get(from).push(to);
  }

  trace(node) {
    return this.nodes.get(node) || [];
  }
}

module.exports = { ExecutionDAG };
