const store = require("./store/engine");

/**
 * Recover execution by ID
 */
function recoverExecution(executionId, executor) {
  const record = store.getExecutionById(executionId);

  if (!record) {
    throw new Error("EXECUTION_NOT_FOUND");
  }

  return executor(record.planWrapper, record.context);
}

/**
 * List all past executions
 */
function listExecutions() {
  return store.getExecutions();
}

module.exports = {
  recoverExecution,
  listExecutions
};
