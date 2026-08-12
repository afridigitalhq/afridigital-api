import fs from "fs";

const file="modules/core/.data/afribuild-build-jobs.json";

function load(){
 if(!fs.existsSync(file)){
  fs.writeFileSync(file,"[]");
 }
 return JSON.parse(fs.readFileSync(file));
}

function save(data){
 fs.writeFileSync(file,JSON.stringify(data,null,2));
}

const AfriBuildBuildJob={

 create(request={}){

  const jobs=load();

  const job={
   jobId:"build_"+Date.now(),
   userId:request.userId,
   product:"AfriBuild",
   appName:request.appName || "UntitledApp",
   plan:request.plan || null,
   status:"BUILD_QUEUED",
   createdAt:new Date().toISOString()
  };

  jobs.push(job);
  save(jobs);

  return job;

 },

 list(){
  return load();
 }

};

export default AfriBuildBuildJob;
