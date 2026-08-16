import fs from "fs";
import path from "path";

const file="modules/core/.data/afri-device-verifications.json";

function load(){
 if(!fs.existsSync(file)){
  fs.mkdirSync(path.dirname(file),{recursive:true});
  fs.writeFileSync(file,"[]");
 }
 return JSON.parse(fs.readFileSync(file));
}

const AfriDeviceVerificationEngine={

 record(data={}){

  const records=load();

  const verification={
   deviceVerificationId:"device_verify_"+Date.now(),
   releaseId:data.releaseId,
   buildId:data.buildId,
   appName:data.appName,
   device:data.device || "ANDROID_DEVICE",
   installStatus:data.installStatus || "PENDING",
   launchStatus:data.launchStatus || "PENDING",
   afriAIStatus:data.afriAIStatus || "PENDING",
   webviewStatus:data.webviewStatus || "PENDING",
   status:"DEVICE_TEST_RECORDED",
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

export default AfriDeviceVerificationEngine;
