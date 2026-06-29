const fs=require("fs");

const source=`class SyscallGate{
  constructor(runtime){
    if(!runtime || typeof runtime.dispatch!=="function"){
      throw new Error("SyscallGate: invalid RuntimeCore");
    }
    this.runtime=runtime;
  }

  dispatch(event){
    return this.runtime.dispatch(event);
  }

  snapshot(){
    return this.runtime.snapshot();
  }

  telemetry(){
    return this.runtime.telemetry();
  }

  ledger(){
    return this.runtime.ledger();
  }
}

module.exports={SyscallGate};
`;

fs.writeFileSync("bootstrap/kernel-v2/output/syscallgate.js",source);

console.log("✅ SyscallGate V2 generated");
