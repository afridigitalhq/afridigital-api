// AFRIKERNEL_GOVERNED_RUNTIME: ALL EXECUTION MUST FLOW VIA SYSCALLGATE
const { emit } = require("../UnifiedEventContract");

function kernelIngress(event) {
  // ALL EVENTS MUST PASS THROUGH HERE
  return emit(event);
}

module.exports = { kernelIngress };
