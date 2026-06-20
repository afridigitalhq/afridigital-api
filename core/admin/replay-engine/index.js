/**
 * ⏪ Admin Decision Replay Mode Engine
 * Time-travel AI decision visualization system
 */

const traces = [];

/**
 * 🧠 Store full decision lifecycle
 */
function recordTrace(data) {

  const trace = {
    traceId: Date.now(),
    timestamp: new Date().toISOString(),
    ...data
  };

  traces.push(trace);

  return trace.traceId;
}

/**
 * ⏪ Replay a specific decision
 */
function replayTrace(traceId) {

  return traces.find(t => t.traceId === traceId);
}

/**
 * 📜 Get all traces (admin audit log)
 */
function getAllTraces() {

  return {
    total: traces.length,
    traces
  };
}

module.exports = {
  recordTrace,
  replayTrace,
  getAllTraces
};
