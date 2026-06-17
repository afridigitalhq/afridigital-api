const bus = require("./eventBus");

// lazy load graph (avoids circular dependency issues)
function getGraph() {
  return require("../../graph/builder");
}

function bindGraphConnector() {
  const graph = getGraph();

  // HTTP → Graph node
  bus.on("http_request", (e) => {
    graph.addNode({
      type: "http",
      traceId: e.traceId,
      path: e.path,
      method: e.method,
      timestamp: e.timestamp
    });
  });

  // Worker → Graph node
  bus.on("worker_event", (e) => {
    graph.addNode({
      type: "worker",
      traceId: e.traceId,
      action: e.type,
      timestamp: e.timestamp
    });
  });

  // AI → Graph node
  bus.on("ai_event", (e) => {
    graph.addNode({
      type: "ai",
      traceId: e.traceId,
      model: e.model,
      timestamp: e.timestamp
    });
  });

  console.log("🧠 Graph connector active (v4 → v2)");
}

module.exports = { bindGraphConnector };
