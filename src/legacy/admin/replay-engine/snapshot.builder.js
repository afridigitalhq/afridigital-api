const { getAllTraces } = require("./trace.store");

/**
 * Builds a time-based snapshot of system state
 */
function buildSnapshot(timestampWindow = 60000) {

  const now = Date.now();

  const traces = getAllTraces().filter(t =>
    now - t.timestamp <= timestampWindow
  );

  return {
    window: timestampWindow,
    count: traces.length,
    traces
  };
}

module.exports = { buildSnapshot };
