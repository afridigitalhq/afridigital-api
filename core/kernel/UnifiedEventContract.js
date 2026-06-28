// AFRIKERNEL_GOVERNED_RUNTIME: ALL EXECUTION MUST FLOW VIA SYSCALLGATE
const { normalize } = require("./KernelNormalizationLayer");
const { assertAdapter } = require("./SprawlGuard");

function emit(event) {
  assertAdapter(event.source);
  return normalize(event);
}

module.exports = { emit };
