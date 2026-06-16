const fs = require("fs");
const path = require("path");

const LOG_FILE = path.join(__dirname, "executions.log");

/**
 * Append execution snapshot (JSONL format)
 */
function saveExecution(record) {
  fs.appendFileSync(LOG_FILE, JSON.stringify(record) + "\n");
}

/**
 * Read all executions
 */
function getExecutions() {
  if (!fs.existsSync(LOG_FILE)) return [];

  return fs.readFileSync(LOG_FILE, "utf-8")
    .split("\n")
    .filter(Boolean)
    .map(line => JSON.parse(line));
}

/**
 * Get execution by ID
 */
function getExecutionById(id) {
  return getExecutions().find(r => r.id === id);
}

/**
 * Replay execution (minimal deterministic replay)
 */
function replayExecution(id, executor) {
  const exec = getExecutionById(id);
  if (!exec) throw new Error("EXECUTION_NOT_FOUND");

  return executor(exec.planWrapper, exec.context);
}

module.exports = {
  saveExecution,
  getExecutions,
  getExecutionById,
  replayExecution
};
