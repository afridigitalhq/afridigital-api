const { assertApiVersion } = require("../runtime/safety/api.guard");
const { updateWeights, getWeights } =
require('../weights/behavior.weights');

function runAdaptiveBrain(metrics) {

  const updated =
    updateWeights(metrics);

  console.log('🧠 ADAPTIVE BRAIN ACTIVE');
  console.log('⚙️ Updated Weights:', updated);

  return updated;
}

module.exports = {
  runAdaptiveBrain
};
