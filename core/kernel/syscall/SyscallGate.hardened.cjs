// AFRIKERNEL_GOVERNED_RUNTIME: ALL EXECUTION MUST FLOW VIA SYSCALLGATE
const { validateImport } = require("../_hardening/import.guard.cjs");

class SyscallGate {
  constructor(core) {
    this.core = core;
  }

  dispatch(event, source = "unknown") {
    validateImport(source);

    if (!this.core) {
      throw new Error("SyscallGate: missing core runtime");
    }

    return this.core.dispatch(event);
  }
}

module.exports = { SyscallGate };
