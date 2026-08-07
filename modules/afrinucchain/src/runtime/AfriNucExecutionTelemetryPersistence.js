import fs from "fs";
import path from "path";

export class AfriNucExecutionTelemetryPersistence {

  constructor(){

    this.component="AfriNuc Execution Telemetry Persistence";
    this.base="modules/afrinucchain/.data/execution-telemetry";

    fs.mkdirSync(this.base,{recursive:true});

  }

  save(event){

    const file=path.join(
      this.base,
      `${event.telemetryId}.json`
    );

    fs.writeFileSync(
      file,
      JSON.stringify(event,null,2)
    );

    return {
      component:this.component,
      status:"SAVED",
      telemetryId:event.telemetryId,
      file,
      savedAt:new Date().toISOString()
    };

  }

  load(telemetryId){

    const file=path.join(
      this.base,
      `${telemetryId}.json`
    );

    return JSON.parse(
      fs.readFileSync(file,"utf-8")
    );

  }

}
