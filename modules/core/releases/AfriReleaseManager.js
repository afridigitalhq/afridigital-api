import fs from "fs";

const file="modules/core/.data/afri-releases.json";

function load(){
 if(!fs.existsSync(file)) return [];
 return JSON.parse(fs.readFileSync(file));
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
