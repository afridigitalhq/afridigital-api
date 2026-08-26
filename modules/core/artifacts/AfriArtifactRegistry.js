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

const RETAIN_LIMIT=3;

function applyRetention(artifacts){
 const groups=new Map();
 for(const artifact of artifacts){
  const key=`${artifact.product || "AfriBuild"}::${artifact.name || "Untitled"}`;
  if(!groups.has(key)) groups.set(key,[]);
  groups.get(key).push(artifact);
 }
 for(const group of groups.values()){
  group.sort((a,b)=>String(b.createdAt||"").localeCompare(String(a.createdAt||"")));
  group.forEach((artifact,index)=>{
   if(index>=RETAIN_LIMIT && artifact.status==="ARTIFACT_READY"){
    artifact.status="ARTIFACT_RETAINED_HISTORY";
    artifact.retiredAt=artifact.retiredAt || new Date().toISOString();
   }
  });
 }
 return artifacts;
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
   file:data.file || null,
   size:data.size || 0,
   checksum:data.checksum || null,
   downloadId:data.downloadId || null,
   status:"ARTIFACT_READY",
   createdAt:new Date().toISOString()
  };

  artifacts.push(artifact);
  save(artifacts);

  return artifact;

 },

 list(){
  return load();
 },

 listByUser(userId){
  if(!userId) return [];
  return load().filter(artifact => artifact.userId === userId);
 }

};

export default AfriArtifactRegistry;
