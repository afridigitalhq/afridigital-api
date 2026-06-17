export class TimeRewindEngine {
  constructor(store) {
    this.store = store;
  }

  replay(events, index) {
    const snapshot = {
      nodes: {},
      edges: []
    };

    for (let i = 0; i < index; i++) {
      const e = events[i];

      if (e.type === "NODE_UPDATE") {
        snapshot.nodes[e.node] = e;
      }

      if (e.type === "EDGE_UPDATE") {
        snapshot.edges.push(e);
      }
    }

    return snapshot;
  }
}
