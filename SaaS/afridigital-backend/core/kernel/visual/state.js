const liveState = {
  nodes: [],
  edges: [],
  executions: []
};

function updateNode(node, status) {
  liveState.nodes.push({ node, status, ts: Date.now() });
}

function updateEdge(from, to) {
  liveState.edges.push({ from, to });
}

function addExecution(exec) {
  liveState.executions.push(exec);
}

function getState() {
  return liveState;
}

module.exports = {
  updateNode,
  updateEdge,
  addExecution,
  getState
};
