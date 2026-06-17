
const traces = [];

function startTrace(payload) {
  const trace = {
    id: Date.now() + '-' + Math.random(),
    start: Date.now(),
    payload
  };

  traces.push(trace);
  return trace;
}

function endTrace(trace, result) {
  trace.end = Date.now();
  trace.result = result;
  trace.duration = trace.end - trace.start;
  return trace;
}

function getTraces(limit = 50) {
  return traces.slice(-limit);
}

module.exports = { startTrace, endTrace, getTraces };

