const bus = require("../../core/eventBus");

let traces = [];

bus.on("AI_ORCHESTRATOR_TRACE", (data) => {

  traces.push({
    ...data,
    receivedAt: Date.now()
  });

  if (traces.length > 500) {
    traces.shift(); // keep memory bounded
  }
});

function getTraces() {
  return traces.slice(-200);
}

module.exports = { getTraces };
