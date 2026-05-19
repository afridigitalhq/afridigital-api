/**
 * 🐕 WATCHDOG PRE-EVOLUTION FILTER
 * Blocks risky proposals BEFORE admin sees them
 */

function watchdogFilter(proposal) {

  if (!proposal) return { allow: false };

  if (proposal.riskScore > 0.75) {
    return {
      allow: false,
      reason: "HIGH_RISK_BLOCKED_BY_WATCHDOG"
    };
  }

  if (proposal.explanation.includes("unsafe")) {
    return {
      allow: false,
      reason: "POLICY_VIOLATION"
    };
  }

  return { allow: true };
}

module.exports = { watchdogFilter };
