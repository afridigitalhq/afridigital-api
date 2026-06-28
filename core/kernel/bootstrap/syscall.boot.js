const { enforceNoMultipleInstances } = require("../_enforce/syscallgate.guard"); enforceNoMultipleInstances();
// AFRIKERNEL_GOVERNED_RUNTIME: ALL EXECUTION MUST FLOW VIA SYSCALLGATE
const { SyscallGate } = require("../syscall/SyscallGate");

/**
 * Deterministic kernel bootstrap
 * No interceptors, no mutation layers, no runtime patching.
 */

function createKernel(core) {
  if (!core) {
    throw new Error("Kernel boot failed: missing core runtime");
  }

  const gate = // REMOVED_ILLEGAL_INSTANTIATION(core);

  return {
    dispatch: (event) => gate.dispatch(event),
    gate
  };
}

module.exports = { createKernel };
