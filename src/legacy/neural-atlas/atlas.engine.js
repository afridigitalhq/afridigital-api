const graph = { nodes: [], edges: [] };

function updateEdgeWeight(edge, success) {
  if (success) edge.weight = Math.min(1, edge.weight + 0.03);
  else edge.weight = Math.max(0.05, edge.weight - 0.05);
}

function decay() {
  graph.edges.forEach(e => {
    e.weight *= 0.995;
  });
}

function registerFlow(from, to, success = true) {
  let edge = graph.edges.find(e => e.from === from && e.to === to);

  if (!edge) {
    edge = { from, to, weight: 0.5, success: 0, fail: 0 };
    graph.edges.push(edge);
  }

  success ? edge.success++ : edge.fail++;
  updateEdgeWeight(edge, success);

  return edge;
}

function topology() {
  return graph;
}

module.exports = { registerFlow, decay, topology };
