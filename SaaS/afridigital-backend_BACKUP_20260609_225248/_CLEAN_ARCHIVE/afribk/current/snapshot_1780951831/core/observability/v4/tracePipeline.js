const bus = require("./eventBus");
const { bindTraceStreamBridge } = require("./traceStreamBridge").bindTraceStreamBridge;

/**
 * TRACE PIPELINE V4 (CLEAN STATE)
 * - single event bus
 * - safe graph ingestion
 * - no SSE duplication logic here
 */

function mountTraceSystem(app) {
  // Prevent duplicate listeners safely
  bus.removeAllListeners("http_request");
  bus.removeAllListeners("worker_event");
  bus.removeAllListeners("ai_event");

  // Attach graph bridge (safe if exists)
  if (typeof bindTraceStreamBridge === "function") {
    bindTraceStreamBridge(bus);
  }

  console.log("🔗 TRACE PIPELINE ACTIVE (CLEAN V4)");

  return {
    status: "mounted",
    graph: true,
    sse: false
  };
}

module.exports = {
  mountTraceSystem
};
