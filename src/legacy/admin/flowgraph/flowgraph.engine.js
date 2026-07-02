const bus = require("../../core/eventBus");

let graph = {
  nodes: [],
  edges: []
};

function addNode(type, payload) {

  const node = {
    id: Math.random().toString(36).slice(2),
    type,
    payload,
    timestamp: Date.now()
  };

  graph.nodes.push(node);

  return node;
}

function connectNodes(from, to) {

  graph.edges.push({
    from,
    to,
    timestamp: Date.now()
  });
}

bus.on("POLICY_DECISION", (data) => {
  const node = addNode("POLICY_DECISION", data);
});

bus.on("ECONOMY_OPTIMIZATION", (data) => {
  const node = addNode("ECONOMY", data);
});

bus.on("MARKETPLACE_UPDATED", (data) => {
  const node = addNode("MARKET", data);
});

function getGraph() {
  return graph;
}

module.exports = { getGraph };
