const { resolveWorker } = require("../workers/registry");
const executor = require("./runtime");

/**
 * Execute DAG using real workers
 */
function runDag(fromFile, request, runtime, options = {}) {
  const plan = runtime.enforce(fromFile, request).plan;

  const results = [];

  for (const node of plan.path) {
    const worker = resolveWorker(node);

    const result = worker(node, options.context || {});
    results.push({ node, result });
  }

  return {
    mode: options.mode || "sequential",
    results
  };
}

module.exports = {
  runDag
};
