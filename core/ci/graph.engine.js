let graph = {
  nodes: [],
  edges: [],
  state: "idle"
};

function emitNode(type, payload) {
  const node = {
    id: Date.now(),
    type,
    payload,
    ts: Date.now()
  };

  graph.nodes.push(node);
  return node;
}

function linkNodes(from, to) {
  graph.edges.push({ from, to });
}

function setState(state) {
  graph.state = state;
}

function getGraph() {
  return graph;
}

module.exports = {
  emitNode,
  linkNodes,
  setState,
  getGraph
};
