// AFRIKERNEL_GOVERNED_RUNTIME: ALL EXECUTION MUST FLOW VIA SYSCALLGATE
const rules = {
  DEPLOY_REQUEST: { quorum: 2, requiresApproval: true },
  FLAG_UPDATE: { quorum: 1, requiresApproval: false },
  ROLLBACK: { quorum: 2, requiresApproval: true }
};

function getRule(type) {
  return rules[type] || { quorum: 1, requiresApproval: false };
}

module.exports = { getRule };
