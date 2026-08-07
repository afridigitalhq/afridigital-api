import fs from "fs";

export class AfriFixExecutionStore {
  constructor(file="modules/afrifix/evidence/runtime/executions.json"){
    this.file=file;

    if(!fs.existsSync(this.file)){
      fs.writeFileSync(this.file,"[]");
    }
  }

  save(execution={}){
    const records=JSON.parse(fs.readFileSync(this.file,"utf8"));
    records.push(execution);
    fs.writeFileSync(this.file,JSON.stringify(records,null,2));

    return{
      component:"AfriFix Execution Store",
      status:"SAVED",
      total:records.length,
      executionId:execution.executionId,
      file:this.file,
      timestamp:new Date().toISOString()
    };
  }

  load(){
    return JSON.parse(fs.readFileSync(this.file,"utf8"));
  }
}
