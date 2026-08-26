import fs from "fs";

const file="modules/core/.data/afri-apk-exports.json";

function load(){
 if(!fs.existsSync(file)) return [];
 return JSON.parse(fs.readFileSync(file));
}

const AfriAPKExportEngine={

 export(request={}){

  const exports=load();

  const record={
   exportId:"apk_export_"+Date.now(),
   artifactId:request.artifactId,
   jobId:request.jobId,
   userId:request.userId,
   product:request.product,
   appName:request.appName,
   type:"APK",
   version:"1.0.0",
   status:"APK_READY",
   downloadPath:
    "/downloads/"+request.appName+".apk",
   createdAt:new Date().toISOString()
  };

  exports.push(record);

  fs.writeFileSync(
   file,
   JSON.stringify(exports,null,2)
  );

  return record;

 }

};

export default AfriAPKExportEngine;
