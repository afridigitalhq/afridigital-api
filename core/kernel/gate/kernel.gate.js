// AFRIKERNEL_GOVERNED_RUNTIME: ALL EXECUTION MUST FLOW VIA SYSCALLGATE
const { kernelGate } = require("../event.spine");

function kernelGate(event, context = {}) {
  if (!event || !event.type) {
    throw new Error("INVALID_EVENT");
  }

  // enforce all entry through gate only
  return kernelGate({
    ...event,
    source: context.source || "unknown",
    authorized: true
  });
}

module.exports = { kernelGate };
