
/**
 * 🛡 A3.12 SAFE KERNEL GUARD
 * Prevents uncontrolled self-modification
 * Enforces bounded AI evolution
 */

const rules = {
  allowSelfModify: true,
  maxChangePerCycle: 0.15, // 15% behavior shift limit
  requireApprovalFor: [
    "routing_change",
    "financial_logic_change",
    "security_policy_change"
  ],
  safeMode: true
};

function validateChange(change) {
  if (!change) return false;

  // Block dangerous modifications
  if (change.scope === "security" && !change.approved) {
    return { ok: false, reason: "SECURITY_CHANGE_BLOCKED" };
  }

  if (change.magnitude > rules.maxChangePerCycle) {
    return { ok: false, reason: "CHANGE_TOO_LARGE" };
  }

  return { ok: true };
}

function applySafeEvolution(engineState, proposedChange) {
  const check = validateChange(proposedChange);

  if (!check.ok) {
    return {
      status: "REJECTED",
      reason: check.reason,
      state: engineState
    };
  }

  return {
    status: "APPLIED",
    state: {
      ...engineState,
      ...proposedChange.patch
    }
  };
}

module.exports = {
  rules,
  validateChange,
  applySafeEvolution
};

