const bus = require("../../core/eventBus");

let traces = [];

bus.on("AI_ORCHESTRATOR_TRACE", (data) => {
  traces.push(data);
});

function getTraces() {
  return traces.slice(-200);
}

module.exports = { getTraces };
