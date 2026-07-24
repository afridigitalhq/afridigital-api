const {RuntimeCore}=require("./runtime-core");
const {SyscallGate}=require("./syscallgate");

function createKernel(services={}){

  const runtime=new RuntimeCore(services);
  const gate=new SyscallGate(runtime);

  return {
    dispatch:(event)=>gate.dispatch(event),
    snapshot:()=>gate.snapshot(),
    telemetry:()=>gate.telemetry(),
    ledger:()=>gate.ledger(),
    runtime,
    gate
  };

}

module.exports={createKernel};
