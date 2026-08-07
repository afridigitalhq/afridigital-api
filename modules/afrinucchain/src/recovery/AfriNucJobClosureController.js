import fs from "fs";

export class AfriNucJobClosureController {

  constructor(){
    this.component="AfriNuc Job Closure Controller";
    this.dir="modules/afrinucchain/.data/job-closures";
    fs.mkdirSync(this.dir,{recursive:true});
  }

  close({jobId,batchId,workspaceId,deliveryId}){

    const closureId=`closure-${Date.now()}`;

    const record={
      closureId,
      component:this.component,
      jobId,
      batchId,
      workspaceId,
      deliveryId,
      status:"JOB_CLOSED",
      closedAt:new Date().toISOString()
    };

    const file=`${this.dir}/${closureId}.json`;

    fs.writeFileSync(
      file,
      JSON.stringify(record,null,2)
    );

    return {
      component:this.component,
      status:"CLOSED",
      closure:record,
      file
    };
  }
}
