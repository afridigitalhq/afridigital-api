const atlas = require("../neural-atlas/atlas.core");

class FlowGraph3D {
  constructor() {
    this.frame = 0;
  }

  getScene() {
    const graph = atlas.getGraph();

    const nodes = graph.nodes.map(n => ({
      id: n.id,
      x: Math.random() * 10 - 5,
      y: Math.random() * 10 - 5,
      z: Math.random() * 10 - 5,
      weight: n.weight,
      activity: n.activity
    }));

    const edges = graph.edges.map(e => ({
      from: e.from,
      to: e.to,
      strength: e.hits,
      health: e.success / Math.max(1, e.hits)
    }));

    return { nodes, edges, frame: this.frame++ };
  }
}

module.exports = new FlowGraph3D();
