// AFRIKERNEL_GOVERNED_RUNTIME: ALL EXECUTION MUST FLOW VIA SYSCALLGATE
const { appendEvent } = require("./event.ledger");

function kernelGate(event) {
  if (!event || !event.type) {
    throw new Error("INVALID_KERNEL_EVENT");
  }

  const stored = appendEvent(event);

  // optional hook for future WS broadcast
  return stored;
}

module.exports = { kernelGate };
// DEPRECATED (SAFE MODE): superseded by canonical kernel map
