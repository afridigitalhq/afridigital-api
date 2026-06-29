const SyscallGate = require("./syscall/SyscallGate");

function createKernel(core = {}) {
  const gate = new SyscallGate(core);

  return {
    core: {
      dispatch: (e) => gate.dispatch(e),
      snapshot: () => gate.snapshot ? gate.snapshot() : {},
      telemetry: () => gate.telemetry ? gate.telemetry() : {},
      ledger: () => gate.ledger ? gate.ledger() : []
    },
    syscalls: gate,
    meta: {
      version: "1.0.0",
      mode: "production"
    }
  };
}

module.exports = { createKernel };
