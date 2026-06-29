// AFRIKERNEL_GOVERNED_RUNTIME: ALL EXECUTION MUST FLOW VIA SYSCALLGATE
require("./global.import.interceptor");

const { SyscallGate } = require("../syscall/SyscallGate");

function bootKernel(core){
  if(!core){
    throw new Error("Kernel boot failed: missing core runtime");
  }

  const gate=new SyscallGate(core);

  global.SyscallGate=gate;

  return gate;
}

module.exports={bootKernel};
