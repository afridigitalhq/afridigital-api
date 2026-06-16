const { ExecutionGraph } = require("./dag/graph");
const { Scheduler } = require("./scheduler/queue");

const graph = new ExecutionGraph();
const scheduler = new Scheduler();

function registerFlow(node, next) {
  graph.add(node, next);
}

function schedule(task) {
  scheduler.add(task);
}

module.exports = {
  graph,
  scheduler,
  registerFlow,
  schedule
};
