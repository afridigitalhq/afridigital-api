// AFRIKERNEL_GOVERNED_RUNTIME: ALL EXECUTION MUST FLOW VIA SYSCALLGATE
const { KernelOrchestrator } = require("./KernelOrchestrator");

module.exports = {
  orchestrator: (deps) => new KernelOrchestrator(deps)
};
