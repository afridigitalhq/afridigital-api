// AFRIKERNEL_GOVERNED_RUNTIME: ALL EXECUTION MUST FLOW VIA SYSCALLGATE
const { assertKernelBoundary } = require("../guard/kernel.boundary");

function safeDispatch(gate, event) {
  assertKernelBoundary(event?.source || "");
  return gate.dispatch(event);
}

module.exports = { safeDispatch };
