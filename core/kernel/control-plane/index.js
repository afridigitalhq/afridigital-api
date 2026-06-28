// AFRIKERNEL_GOVERNED_RUNTIME: ALL EXECUTION MUST FLOW VIA SYSCALLGATE
const { HotRuntimeControlPlane } = require("./HotRuntimeControlPlane");

module.exports = (deps) => new HotRuntimeControlPlane(deps);
