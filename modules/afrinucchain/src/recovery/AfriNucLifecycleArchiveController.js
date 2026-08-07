import fs from "fs";

export class AfriNucLifecycleArchiveController {

  constructor(){
    this.component="AfriNuc Lifecycle Archive Controller";
    this.dir="modules/afrinucchain/.data/archive";
    fs.mkdirSync(this.dir,{recursive:true});
  }

  archive({jobId,batchId,workspaceId,closureId}){

    const archiveId=`archive-${Date.now()}`;

    const record={
      archiveId,
      component:this.component,
      jobId,
      batchId,
      workspaceId,
      closureId,
      status:"ARCHIVED",
      archivedAt:new Date().toISOString()
    };

    const file=`${this.dir}/${archiveId}.json`;

    fs.writeFileSync(
      file,
      JSON.stringify(record,null,2)
    );

    return {
      component:this.component,
      status:"ARCHIVED",
      archive:record,
      file
    };
  }
}
