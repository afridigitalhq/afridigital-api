const fs=require("fs");

const target="core/kernel/bootstrap/syscall.boot.js";

const source=`const { enforceNoMultipleInstances } = require("../_enforce/syscallgate.guard");
enforceNoMultipleInstances();

const { SyscallGate } = require("../syscall/SyscallGate");

function createKernel(core){
  if(!core){
    throw new Error("Kernel boot failed: missing core runtime");
  }

  const gate=new SyscallGate(core);

  return {
    dispatch:(event)=>gate.dispatch(event),
    snapshot:()=>gate.snapshot ? gate.snapshot() : {},
    telemetry:()=>gate.telemetry ? gate.telemetry() : {},
    ledger:()=>gate.ledger ? gate.ledger() : [],
    gate
  };
}

module.exports={createKernel};
`;

fs.writeFileSync(target,source);

console.log("✅ Rebuilt",target);
