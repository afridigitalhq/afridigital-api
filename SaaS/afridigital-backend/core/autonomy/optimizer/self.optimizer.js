const { assertApiVersion } = require("../runtime/safety/api.guard");
const { calculateWeights } =
require('../engine/decision.engine');

function optimizeSystem() {

  const weights =
    calculateWeights();

  let strategy = 'balanced';

  if (weights.adWeight > weights.workflowWeight) {
    strategy = 'monetization_priority';
  }

  if (weights.workflowWeight > weights.adWeight) {
    strategy = 'user_experience_priority';
  }

  return {
    strategy,
    weights
  };
}

module.exports = {
  optimizeSystem
};
