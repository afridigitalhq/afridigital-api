export class IncidentTracer {
  constructor(graph = {}) {
    this.graph = graph;
  }

  trace(nodeId) {
    return this.graph[nodeId] || {
      chain: [],
      severity: "unknown"
    };
  }

  getPath(a, b) {
    return [`${a}`, "→", `${b}`];
  }
}
