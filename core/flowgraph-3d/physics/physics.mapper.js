const atlas = require("../../neural-atlas/atlas.core");

function buildPhysicsScene() {
  const graph = atlas.getGraph();

  const nodes = graph.nodes.map(n => {
    const activity = n.activity || 1;

    return {
      id: n.id,
      x: Math.sin(activity + Date.now() * 0.0002) * 3,
      y: Math.cos(activity + Date.now() * 0.0002) * 3,
      z: Math.sin(activity * 0.5) * 2,

      size: Math.min(2, 0.2 + activity * 0.1),
      glow: Math.min(1, activity * 0.2)
    };
  });

  const edges = graph.edges.map(e => {
    const strength = e.hits || 1;
    const health = e.success / Math.max(1, e.hits);

    return {
      from: e.from,
      to: e.to,
      thickness: Math.min(5, 1 + strength * 0.2),
      health
    };
  });

  return { nodes, edges };
}

module.exports = { buildPhysicsScene };
