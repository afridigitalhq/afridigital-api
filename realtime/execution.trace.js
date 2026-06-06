const bus = require("./event.stream");

const traces = [];

function pushTrace(trace) {
  const entry = {
    id: Date.now(),
    timestamp: new Date().toISOString(),
    ...trace
  };

  traces.push(entry);
  bus.emit("EXECUTION_TRACE", entry);
}

function getTraces() {
  return traces;
}

module.exports = { pushTrace, getTraces };
