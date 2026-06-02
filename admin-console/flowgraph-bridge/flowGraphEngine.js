/**
 * PURE VISUAL GRAPH STATE BUILDER
 * (NO BACKEND SIDE EFFECTS)
 */

export class FlowGraphEngine {
  constructor() {
    this.nodes = new Map();
    this.edges = [];
  }

  ingest(event) {
    const { type, traceId } = event;

    // NODE
    if (!this.nodes.has(type)) {
      this.nodes.set(type, {
        id: type,
        activity: 0,
        traces: new Set()
      });
    }

    const node = this.nodes.get(type);
    node.activity += 1;
    node.traces.add(traceId);

    // EDGE (trace relationship approximation)
    if (event.payload?.prevType) {
      this.edges.push({
        from: event.payload.prevType,
        to: type,
        traceId
      });
    }
  }

  getGraph() {
    return {
      nodes: Array.from(this.nodes.values()).map(n => ({
        id: n.id,
        activity: n.activity,
        traceCount: n.traces.size
      })),
      edges: this.edges
    };
  }

  reset() {
    this.nodes.clear();
    this.edges = [];
  }
}
