import fs from "fs";
import path from "path";

export class AfriNucRuntimeStorageInitializer {

  constructor(){
    this.component = "AfriNuc Runtime Storage Initializer";
    this.base = "modules/afrinucchain/.data";
  }

  initialize(){

    const folders = [
      "execution-telemetry",
      "execution-evidence",
      "execution-audit-verification",
      "recovery-audit",
      "recovery-certificates",
      "recovery-packages",
      "client-delivery",
      "job-closures",
      "archive"
    ];

    folders.forEach(folder=>{
      fs.mkdirSync(path.join(this.base,folder),{recursive:true});
    });

    return {
      component:this.component,
      status:"INITIALIZED",
      storage:this.base,
      folders,
      initializedAt:new Date().toISOString()
    };
  }
}
