const { analyzeContext } = require("./context.analyzer");

/**
 * 🧠 Unified AI Dashboard Router
 */
function resolveDashboard(user) {

  const ctx = analyzeContext(user);

  // =========================
  // MODE SELECTION LOGIC
  // =========================

  if (ctx.isNewUser) {
    return {
      mode: "COPILOT",
      reason: "NEW_USER_ONBOARDING"
    };
  }

  if (ctx.isHighEngagement) {
    return {
      mode: "MORPHING",
      reason: "HIGH_INTERACTION_USER"
    };
  }

  if (ctx.isActiveEarner || ctx.isCreator) {
    return {
      mode: "PERSONALIZED",
      reason: "ECONOMY_ACTIVE_USER"
    };
  }

  return {
    mode: "STATIC",
    reason: "DEFAULT_FALLBACK"
  };
}

module.exports = { resolveDashboard };
