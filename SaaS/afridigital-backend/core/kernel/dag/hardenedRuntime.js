const bus = require("../bus/eventBus");
const { resolveWorker } = require("../workers/registry");

const executedNodes = new Set();

/**
 * Safe execution wrapper with retries
 */
function safeExecute(node, context, retries = 2) {
  const worker = resolveWorker(node);

  for (let i = 0; i <= retries; i++) {
    try {
      return worker(node, context);
    } catch (err) {
      if (i === retries) {
        return {
          node,
          status: "FAILED",
          error: err.message
        };
      }
    }
  }
}

/**
 * Hardened distributed execution
 */
function executeDistributed(plan, context = {}) {
  const results = [];

  for (const node of plan.path) {

    // 🔒 prevent duplicate execution
    if (executedNodes.has(node)) continue;
    executedNodes.add(node);

    const result = safeExecute(node, context);

    results.push({ node, result });

    bus.emit("node_executed", { node, result });

    // lightweight failure guard
    if (result && result.status === "FAILED") {
      bus.emit("node_failed", { node, result });
    }
  }

  bus.emit("dag_complete", {
    path: plan.path,
    results
  });

  return {
    mode: "hardened-distributed",
    results
  };
}

module.exports = {
  executeDistributed
};
