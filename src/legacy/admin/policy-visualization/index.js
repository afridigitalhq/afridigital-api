const bus = require("../../eventbus");
const { evaluatePolicy } = require("../../policy-engine");
const { getFlowGraph } = require("../flowgraph");

/**
 * 🧭 Policy Enforcement Visualization Layer (ADMIN ONLY)
 * Shows how rules affect system behavior in real time
 */

const policyGraph = [];

/**
 * Wrap every event with policy evaluation
 */
function processWithPolicy(type, action) {

  const result = evaluatePolicy(type, action);

  const node = {
    type: "POLICY_CHECK",
    actionType: type,
    input: action,
    allowed: result.allowed,
    reason: result.reason || null,
    time: Date.now()
  };

  policyGraph.push(node);

  // If blocked, mark explicitly in flowgraph
  if (!result.allowed) {
    policyGraph.push({
      type: "BLOCKED_EVENT",
      reason: result.reason,
      originalAction: action,
      time: Date.now()
    });
  }

  return result;
}

/**
 * Hook into ECONOMY EVENTS
 */
bus.on("EARN", (data) => {

  processWithPolicy("economy", {
    amount: data.amount,
    userId: data.userId
  });
});

bus.on("SPEND", (data) => {

  processWithPolicy("economy", {
    amount: data.amount,
    userId: data.userId
  });
});

/**
 * ADMIN VIEW: Policy FlowGraph
 */
function getPolicyFlowGraph() {

  return {
    policyChecks: policyGraph.slice(-100),
    systemGraph: getFlowGraph()
  };
}

module.exports = {
  getPolicyFlowGraph,
  processWithPolicy
};
