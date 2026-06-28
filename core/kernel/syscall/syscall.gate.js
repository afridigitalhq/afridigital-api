// AFRIKERNEL_GOVERNED_RUNTIME: ALL EXECUTION MUST FLOW VIA SYSCALLGATE
class SyscallGate {
  constructor(kernel) {
    this.kernel = kernel;
  }

  dispatch(syscall) {
    return this.kernel.ingest({
      type: "syscall",
      op: syscall.op,
      payload: syscall.payload,
      ring: syscall.ring || "R2"
    });
  }
}
module.exports = { SyscallGate };
