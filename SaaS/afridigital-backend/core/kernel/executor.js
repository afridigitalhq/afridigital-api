const { resolveWorker } = require("./workers/registry");
const bus = require("./bus/eventBus");
const store = require("./store/engine");

function generateId() {
  return "exec_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8);
}

function executePlan(planWrapper, context = {}) {
  const plan = planWrapper.plan;

  if (!plan || !Array.isArray(plan.path)) {
    throw new Error("INVALID_PLAN");
  }

  const executionId = generateId();
  const results = [];

  for (const node of plan.path) {
    const worker = resolveWorker(node);

    if (typeof worker !== "function") {
      throw new Error(`INVALID_WORKER_FOR_NODE: ${node}`);
    }

    const result = worker(node, context);

    results.push({ node, result });

    bus?.emit?.("node_done", { node, result });
  }

  const executionRecord = {
    id: executionId,
    timestamp: Date.now(),
    planWrapper,
    context,
    results,
    status: "completed"
  };

  // 💾 PERSIST EXECUTION
  store.saveExecution(executionRecord);

  bus?.emit?.("dag_complete", {
    plan,
    results,
    executionId
  });

  return {
    executionId,
    status: "completed",
    results
  };
}

module.exports = {
  executePlan
};
