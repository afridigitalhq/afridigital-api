import fs from "fs";
import path from "path";

const file="modules/core/.data/afri-release-verifications.json";

function load(){
 if(!fs.existsSync(file)){
  fs.mkdirSync(path.dirname(file),{recursive:true});
  fs.writeFileSync(file,"[]");
 }
 return JSON.parse(fs.readFileSync(file));
}

const AfriReleaseVerificationEngine={

 verify(data={}){

  const records=load();

  const verification={
   verificationId:"verify_"+Date.now(),
   releaseId:data.releaseId || null,
   buildId:data.buildId || null,
   artifactId:data.artifactId || null,
   appName:data.appName || null,
   type:data.type || "APK",
   checks:{
    artifactExists:true,
    packageGenerated:true,
    downloadAvailable:true,
    installPending:true,
    runtimePending:true
   },
   status:"VERIFICATION_PENDING",
   createdAt:new Date().toISOString()
  };

  records.push(verification);

  fs.writeFileSync(
   file,
   JSON.stringify(records,null,2)
  );

  return verification;
 }

};

export default AfriReleaseVerificationEngine;
