// AFRIKERNEL_GOVERNED_RUNTIME: ALL EXECUTION MUST FLOW VIA SYSCALLGATE
/**
 * CANONICAL SYSCTALLGATE ENTRYPOINT
 * All other implementations are deprecated aliases.
 */

const { SyscallGate } = require("./SyscallGate.hardened.cjs");

module.exports = { SyscallGate };
