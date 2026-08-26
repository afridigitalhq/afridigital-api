import fs from "fs";

const file="modules/core/.data/afri-releases.json";

function load(){
 if(!fs.existsSync(file)) return [];
 return JSON.parse(fs.readFileSync(file));
}

const RETAIN_LIMIT=3;

function applyRetention(releases){
 const groups=new Map();
 for(const release of releases){
  const key=`${release.product || "AfriBuild"}::${release.appName || "Untitled"}`;
  if(!groups.has(key)) groups.set(key,[]);
  groups.get(key).push(release);
 }
 for(const group of groups.values()){
  group.sort((a,b)=>String(b.createdAt||"").localeCompare(String(a.createdAt||"")));
  group.forEach((release,index)=>{
   if(index>=RETAIN_LIMIT && release.status==="RELEASE_CERTIFIED"){
    release.status="RELEASE_RETAINED_HISTORY";
    release.retiredAt=release.retiredAt || new Date().toISOString();
   }
  });
 }
 return releases;
}

const AfriReleaseManager={

 certify(request={}){

  const releases=load();

  const record={
   releaseId:"release_"+Date.now(),
   buildId:request.buildId,
   exportId:request.exportId,
   artifactId:request.artifactId,
   userId:request.userId,
   product:request.product,
   appName:request.appName,
   version:request.version || "1.0.0",
   type:"APK",
   checksum:request.checksum || null,
   status:"RELEASE_CERTIFIED",
   createdAt:new Date().toISOString()
  };

  releases.push(record);

  fs.writeFileSync(
   file,
   JSON.stringify(releases,null,2)
  );

  return record;

 }

};

export default AfriReleaseManager;
