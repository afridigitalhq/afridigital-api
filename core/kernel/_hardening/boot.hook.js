// AFRIKERNEL_GOVERNED_RUNTIME: ALL EXECUTION MUST FLOW VIA SYSCALLGATE
require("./global.import.interceptor");

const { SyscallGate } = require("../syscall/SyscallGate");

function bootKernel(core) {
  const gate = // REMOVED_ILLEGAL_INSTANTIATION(core);
  global.SyscallGate = gate;

  return gate;
}

module.exports = { bootKernel };
