import fs from "fs";
import path from "path";

export class AfriJobPersistence {
  constructor(){
    this.base="modules/afrinucchain/.data/jobs";
    fs.mkdirSync(this.base,{recursive:true});
  }

  save(job){
    const file=path.join(this.base,`${job.jobId}.json`);
    fs.writeFileSync(
      file,
      JSON.stringify(job,null,2)
    );

    return {
      component:"AfriNuc Job Persistence",
      status:"SAVED",
      jobId:job.jobId,
      file,
      savedAt:new Date().toISOString()
    };
  }

  load(jobId){
    const file=path.join(this.base,`${jobId}.json`);

    if(!fs.existsSync(file)){
      return {
        component:"AfriNuc Job Persistence",
        status:"NOT_FOUND",
        jobId
      };
    }

    return JSON.parse(fs.readFileSync(file,"utf-8"));
  }
}
