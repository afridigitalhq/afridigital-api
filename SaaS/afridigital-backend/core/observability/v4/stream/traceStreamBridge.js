const bus = require("../../eventbus");

/**
 * OPTIONAL: enrich events for graph system
 * keeps SSE + graph in sync
 */
function bindTraceGraphBridge(graphConnector) {

  const forward = (type) => (payload) => {
    const enriched = {
      ...payload,
      nodeType: type
    };

    // send into graph system (if exists)
    if (graphConnector?.ingest) {
      graphConnector.ingest(enriched);
    }
  };

  bus.on("http_request", forward("http"));
  bus.on("worker_event", forward("worker"));
  bus.on("ai_event", forward("ai"));

  console.log("🔗 Trace → Graph bridge ACTIVE");
}

module.exports = { bindTraceGraphBridge };
