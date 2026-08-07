import fs from "fs";
import path from "path";

export class AfriAuditPersistence {
  constructor(){
    this.base="modules/afrinucchain/.data/audit";
    fs.mkdirSync(this.base,{recursive:true});
  }

  save(jobId,events){
    const file=path.join(this.base,`${jobId}.json`);

    const record={
      jobId,
      events,
      savedAt:new Date().toISOString()
    };

    fs.writeFileSync(
      file,
      JSON.stringify(record,null,2)
    );

    return {
      component:"AfriNuc Audit Persistence",
      status:"SAVED",
      jobId,
      events:events.length,
      file
    };
  }

  load(jobId){
    const file=path.join(this.base,`${jobId}.json`);

    if(!fs.existsSync(file)){
      return {
        component:"AfriNuc Audit Persistence",
        status:"NOT_FOUND",
        jobId
      };
    }

    return JSON.parse(fs.readFileSync(file,"utf-8"));
  }
}
