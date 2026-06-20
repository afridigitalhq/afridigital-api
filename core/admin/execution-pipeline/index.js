/**
 * ⚙️ Execution Approval Pipeline
 * Safe commit system for marketplace + economy changes
 */

const { createSnapshot } = require("../snapshots");

const executionLog = [];

/**
 * Execute approved action safely
 */
function executeAction(systemState, action) {

  // STEP 1: snapshot before change
  const snapshotId = createSnapshot(systemState);

  const before = JSON.parse(JSON.stringify(systemState));

  // STEP 2: apply change (simulated mutation)
  let after = JSON.parse(JSON.stringify(systemState));

  if (action.type === "BOOST") {
    after.boostLevel = (after.boostLevel || 1) + action.value;
  }

  if (action.type === "MARKETPLACE") {
    after.marketShift = action.value;
  }

  if (action.type === "POLICY") {
    after.policyMode = action.value;
  }

  // STEP 3: log execution
  const log = {
    id: Date.now(),
    action,
    snapshotId,
    before,
    after,
    timestamp: Date.now(),
    status: "EXECUTED"
  };

  executionLog.push(log);

  return log;
}

/**
 * Rollback to snapshot
 */
function rollback(systemState, snapshot) {

  if (!snapshot) {
    return { error: "NO_SNAPSHOT_FOUND" };
  }

  return {
    restoredState: JSON.parse(JSON.stringify(snapshot.state)),
    status: "ROLLED_BACK"
  };
}

/**
 * Get execution history
 */
function getExecutionLog() {
  return executionLog;
}

module.exports = {
  executeAction,
  rollback,
  getExecutionLog
};
