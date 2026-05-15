/**
 * ⚖ A3.18.9 SAFETY ORCHESTRATOR
 * Combines abuse detection + cooldown system
 */

const { detectAbuse } = require("./abuse/abuse.detector");
const { applyCooldown, isOnCooldown } = require("./cooldown/cooldown.engine");

function evaluateUser(userId, pattern) {

  if (isOnCooldown(userId)) {
    return {
      allowed: false,
      reason: "COOLDOWN_ACTIVE"
    };
  }

  const result = detectAbuse(pattern);

  if (result.isAbusive) {

    applyCooldown(userId, 120000); // 2 min cooldown

    return {
      allowed: false,
      reason: "ABUSE_DETECTED",
      riskScore: result.riskScore,
      action: "COOLDOWN_APPLIED"
    };
  }

  return {
    allowed: true,
    reason: "NORMAL"
  };
}

module.exports = { evaluateUser };
