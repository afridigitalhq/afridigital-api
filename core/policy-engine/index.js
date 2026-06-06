/**
 * 🧭 Policy Engine (AI Governance Layer)
 * Defines system rules for economy + AI + marketplace
 */

const policies = {

  economy: {
    maxWalletSpend: 1000,
    allowNegativeBalance: false
  },

  ai: {
    minPredictionConfidence: 0.6,
    allowAutoSuggestions: true,
    allowAutoExecution: false
  },

  marketplace: {
    maxJobsPerCategory: 500,
    boostLimitPerUser: 3
  },

  ui: {
    adminAccess: true,
    userFlowGraphAccess: false
  }
};

/**
 * Evaluate rule against system action
 */
function evaluatePolicy(type, action) {

  const rules = policies[type];

  if (!rules) return { allowed: true };

  switch (type) {

    case "economy":
      if (action.amount > rules.maxWalletSpend) {
        return { allowed: false, reason: "SPEND_LIMIT_EXCEEDED" };
      }
      break;

    case "ai":
      if (action.confidence < rules.minPredictionConfidence) {
        return { allowed: false, reason: "LOW_CONFIDENCE" };
      }
      break;

    case "marketplace":
      if (action.jobs > rules.maxJobsPerCategory) {
        return { allowed: false, reason: "CATEGORY_LIMIT_REACHED" };
      }
      break;
  }

  return { allowed: true };
}

/**
 * Get system rules (admin view)
 */
function getPolicies() {
  return policies;
}

module.exports = {
  evaluatePolicy,
  getPolicies
};
