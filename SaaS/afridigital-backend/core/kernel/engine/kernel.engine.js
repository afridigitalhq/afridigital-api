const { assertApiVersion } = require("../runtime/safety/api.guard");
const { optimizeKernel } =
require('../optimizer/kernel.optimizer');

function runKernelCycle() {

  const result =
    optimizeKernel();

  console.log('🧠 KERNEL CYCLE RUNNING');
  console.log('⚙️ Mode:', result.mode);
  console.log('📊 Metrics:', result.metrics);

  return result;
}

module.exports = {
  runKernelCycle
};
