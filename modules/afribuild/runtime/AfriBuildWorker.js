import fs from "fs";

const file="modules/core/.data/afribuild-build-jobs.json";

function load(){
 return JSON.parse(fs.readFileSync(file));
}

function save(data){
 fs.writeFileSync(file,JSON.stringify(data,null,2));
}

const AfriBuildWorker={

 run(jobId){

  const jobs=load();

  const job=jobs.find(
   x=>x.jobId===jobId
  );

  if(!job){
   return {
    status:"JOB_NOT_FOUND"
   };
  }

  job.status="BUILD_RUNNING";

  job.sourceGenerated=true;

  job.artifact={
   type:"APP_PACKAGE",
   name:job.appName,
   version:"1.0.0"
  };

  job.status="BUILD_COMPLETED";

  job.completedAt=new Date().toISOString();

  save(jobs);

  return job;

 }

};

export default AfriBuildWorker;
