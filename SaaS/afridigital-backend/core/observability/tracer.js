/**
 * OBSERVABILITY ENGINE v1
 * Tracks full execution lifecycle of every request
 */

const traces = new Map();

function createTrace(traceId, payload) {
  const trace = {
    traceId,
    startedAt: Date.now(),
    payload,
    steps: [],
    status: "running"
  };

  traces.set(traceId, trace);
  return trace;
}

function addStep(traceId, step) {
  const trace = traces.get(traceId);
  if (!trace) return;

  trace.steps.push({
    ...step,
    timestamp: Date.now()
  });
}

function completeTrace(traceId, result) {
  const trace = traces.get(traceId);
  if (!trace) return;

  trace.status = "completed";
  trace.result = result;
  trace.finishedAt = Date.now();
}

function getTrace(traceId) {
  return traces.get(traceId);
}

module.exports = {
  createTrace,
  addStep,
  completeTrace,
  getTrace
};
