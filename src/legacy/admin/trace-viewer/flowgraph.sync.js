const bus = require("../../core/eventBus");

let liveGraph = {
  nodes: [],
  edges: []
};

function addNode(trace) {

  const node = {
    id: trace.traceId + "-" + Math.random().toString(36).slice(2,6),
    type: "AI_STEP",
    label: trace.intent || "UNKNOWN",
    payload: trace,
    timestamp: trace.timestamp
  };

  liveGraph.nodes.push(node);

  return node;
}

function linkNodes(prev, next) {
  liveGraph.edges.push({
    from: prev.id,
    to: next.id,
    timestamp: Date.now()
  });
}

let lastNode = null;

bus.on("AI_ORCHESTRATOR_TRACE", (trace) => {

  const node = addNode(trace);

  if (lastNode) {
    linkNodes(lastNode, node);
  }

  lastNode = node;
});

function getLiveGraph() {
  return liveGraph;
}

module.exports = { getLiveGraph };
