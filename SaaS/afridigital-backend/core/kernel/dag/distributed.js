const bus = require("../bus/eventBus");
const { resolveWorker } = require("../workers/registry");

/**
 * Execute DAG across distributed nodes
 */
function executeDistributed(plan, context = {}) {
  const results = [];

  for (const node of plan.path) {
    const worker = resolveWorker(node);

    const result = worker(node, context);

    results.push({ node, result });

    // broadcast execution event
    bus.emit("node_executed", {
      node,
      result
    });
  }

  bus.emit("dag_complete", {
    path: plan.path,
    results
  });

  return {
    mode: "distributed",
    results
  };
}

module.exports = {
  executeDistributed
};
