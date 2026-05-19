const { assertApiVersion } = require("../runtime/safety/api.guard");
const { optimizeEconomy } =
require('../optimizer/economy.optimizer');

function runEconomyBrain() {

  const result =
    optimizeEconomy();

  console.log('🧠 ECONOMY BRAIN ACTIVE');
  console.log('⚙️ Strategy:', result.strategy);
  console.log('📊 Metrics:', result.metrics);

  return result;
}

module.exports = {
  runEconomyBrain
};
