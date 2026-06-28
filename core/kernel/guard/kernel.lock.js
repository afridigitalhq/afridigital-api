// AFRIKERNEL_GOVERNED_RUNTIME: ALL EXECUTION MUST FLOW VIA SYSCALLGATE
function assertKernelOnly(context) {
  if (context === "event-engine-direct") {
    throw new Error("KERNEL_LOCK_VIOLATION: direct engine access forbidden");
  }
}

module.exports = { assertKernelOnly };
