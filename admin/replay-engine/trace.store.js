const bus = require("../../core/eventBus");

let traces = [];

/**
 * Store every orchestrator decision permanently in memory (later DB-ready)
 */
bus.on("AI_ORCHESTRATOR_TRACE", (trace) => {

  traces.push({
    ...trace,
    storedAt: Date.now()
  });

  if (traces.length > 2000) {
    traces.shift(); // prevent memory overflow
  }
});

function getAllTraces() {
  return traces;
}

function getTraceById(traceId) {
  return traces.filter(t => t.traceId === traceId);
}

function getTraceRange(start, end) {
  return traces.filter((_, i) => i >= start && i <= end);
}

module.exports = {
  getAllTraces,
  getTraceById,
  getTraceRange
};
