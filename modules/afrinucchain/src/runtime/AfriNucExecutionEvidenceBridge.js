import fs from "fs";
import path from "path";

export class AfriNucExecutionEvidenceBridge {

  constructor(){

    this.component="AfriNuc Execution Evidence Bridge";
    this.base="modules/afrinucchain/.data/execution-evidence";

    fs.mkdirSync(this.base,{recursive:true});

  }

  generate({executionId,telemetryId,jobId,status="EXECUTED"}){

    const evidence={
      evidenceId:`evidence-${Date.now()}`,
      component:this.component,
      executionId,
      telemetryId,
      jobId,
      status,
      generatedAt:new Date().toISOString()
    };

    const file=path.join(
      this.base,
      `${evidence.evidenceId}.json`
    );

    fs.writeFileSync(
      file,
      JSON.stringify(evidence,null,2)
    );

    return {
      component:this.component,
      status:"GENERATED",
      evidence,
      file
    };

  }

}
