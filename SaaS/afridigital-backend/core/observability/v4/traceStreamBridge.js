const { resolveBus } = require("./busResolver");

// optional graph connector
let graphConnector = null;

try {
  graphConnector = require("../graphConnector");
} catch (e) {
  console.log("⚠️ graphConnector not available (safe mode)");
}

function bindTraceStreamBridge() {
  const bus = resolveBus();

  const forward = (type) => (payload) => {
    const enriched = {
      type,
      ts: Date.now(),
      ...payload
    };

    if (graphConnector?.ingest) {
      graphConnector.ingest(enriched);
    }
  };

  bus.on("http_request", forward("http"));
  bus.on("worker_event", forward("worker"));
  bus.on("ai_event", forward("ai"));

  console.log("🔗 TRACE STREAM BRIDGE ACTIVE");
}

module.exports = {
  bindTraceStreamBridge
};
