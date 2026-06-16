const { syncState } = require("./sync");
const { getNodeInfo } = require("./node");
const { shouldTakeOver } = require("./failover");
const { executePlan } = require("../executor");

/**
 * Distributed DAG execution entry
 */
function executeDistributed(planWrapper, context = {}) {
  const nodeInfo = getNodeInfo();

  // sync local state first
  syncState(nodeInfo.id, {
    status: "active",
    context
  });

  // failover check
  if (!shouldTakeOver(nodeInfo.id)) {
    return {
      status: "skipped",
      reason: "another node is leader"
    };
  }

  // execute DAG locally
  const result = executePlan(planWrapper, context);

  // sync final state
  syncState(nodeInfo.id, {
    status: "completed",
    lastExecution: result.executionId || null
  });

  return {
    node: nodeInfo.id,
    mode: "distributed",
    result
  };
}

module.exports = {
  executeDistributed
};
