import fs from "fs";

const AfriReleaseVerificationGate={

 verify(request={}){

  const checks={
   apkFileExists:false,
   downloadRecordExists:false,
   installTest:false,
   runtimeTest:false
  };

  const apkPath="modules/core/.data/afri-apk-builds.json";

  if(fs.existsSync(apkPath)){
   const builds=JSON.parse(fs.readFileSync(apkPath));
   checks.apkFileExists=builds.some(
    x=>x.buildId===request.buildId
   );
  }

  const downloadPath="modules/core/.data/afri-download-links.json";

  if(fs.existsSync(downloadPath)){
   const downloads=JSON.parse(fs.readFileSync(downloadPath));
   checks.downloadRecordExists=downloads.some(
    x=>x.buildId===request.buildId
   );
  }

  return {
   releaseId:request.releaseId,
   buildId:request.buildId,
   appName:request.appName,
   checks,
   status:
    checks.apkFileExists &&
    checks.downloadRecordExists
     ? "READY_FOR_DEVICE_TEST"
     : "BLOCKED",
   createdAt:new Date().toISOString()
  };

 }

};

export default AfriReleaseVerificationGate;
