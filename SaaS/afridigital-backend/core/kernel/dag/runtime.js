const dag = require("./engine");

/**
 * Default node executor (can be overridden by plugins/workers)
 */
function defaultHandler(node, context) {
  return {
    node,
    status: "executed",
    context
  };
}

/**
 * Execute DAG plan sequentially
 */
function runSequential(plan, handler = defaultHandler, context = {}) {
  const results = [];

  for (const node of plan.path) {
    const res = handler(node, context);
    results.push(res);

    // pass context forward (stateful DAG)
    context.last = res;
  }

  return {
    mode: "sequential",
    results
  };
}

/**
 * Execute DAG plan in parallel (safe grouped execution)
 */
function runParallel(plan, handler = defaultHandler, context = {}) {
  const results = plan.path.map(node => {
    return handler(node, context);
  });

  return {
    mode: "parallel",
    results
  };
}

/**
 * Main execution entry
 */
function execute(plan, options = {}) {
  const mode = options.mode || "sequential";
  const handler = options.handler || defaultHandler;

  if (!plan || !plan.path) {
    throw new Error("INVALID_DAG_PLAN");
  }

  if (mode === "parallel") {
    return runParallel(plan, handler, options.context || {});
  }

  return runSequential(plan, handler, options.context || {});
}

/**
 * High-level API: enforce → plan → execute
 */
function run(fromFile, request, runtime, options = {}) {
  const plan = runtime.enforce(fromFile, request).plan;

  return execute(plan, {
    mode: options.mode || "sequential",
    handler: options.handler,
    context: options.context
  });
}

module.exports = {
  execute,
  runSequential,
  runParallel,
  run,
  defaultHandler
};
