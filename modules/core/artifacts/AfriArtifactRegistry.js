import fs from "fs";

const file="modules/core/.data/afri-artifact-registry.json";

function load(){
 if(!fs.existsSync(file)){
  fs.writeFileSync(file,"[]");
 }
 return JSON.parse(fs.readFileSync(file));
}

function save(data){
 fs.writeFileSync(file,JSON.stringify(data,null,2));
}

const AfriArtifactRegistry={

 register(data={}){

  const artifacts=load();

  const artifact={
   artifactId:"artifact_"+Date.now(),
   jobId:data.jobId || null,
   userId:data.userId || null,
   product:data.product || "AfriBuild",
   name:data.name || "Untitled",
   type:data.type || "APP_PACKAGE",
   version:data.version || "1.0.0",
   status:"ARTIFACT_READY",
   createdAt:new Date().toISOString()
  };

  artifacts.push(artifact);
  save(artifacts);

  return artifact;

 },

 list(){
  return load();
 }

};

export default AfriArtifactRegistry;
