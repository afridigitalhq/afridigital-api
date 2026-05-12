const { assertApiVersion } = require("../runtime/safety/api.guard");
const { optimizeSystem } =
require('../optimizer/self.optimizer');

function runAutonomyCycle() {

  const decision =
    optimizeSystem();

  console.log('🧠 AUTONOMY CYCLE RUNNING');
  console.log('⚙️ Strategy:', decision.strategy);
  console.log('📊 Weights:', decision.weights);

  return decision;
}

module.exports = {
  runAutonomyCycle
};
