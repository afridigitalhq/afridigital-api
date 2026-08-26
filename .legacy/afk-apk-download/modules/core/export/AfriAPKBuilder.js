import fs from "fs";

const file="modules/core/.data/afri-apk-builds.json";

function load(){
 if(!fs.existsSync(file)) return [];
 return JSON.parse(fs.readFileSync(file));
}

const AfriAPKBuilder={

 build(request={}){

  const builds=load();

  const record={
   buildId:"apk_build_"+Date.now(),
   exportId:request.exportId,
   artifactId:request.artifactId,
   appName:request.appName,
   type:"APK_BINARY",
   version:"1.0.0",
   packageName:"com.afridigital."+request.appName.toLowerCase(),
   file:"/artifacts/"+request.appName+".apk",
   status:"APK_BUILT",
   createdAt:new Date().toISOString()
  };

  builds.push(record);

  fs.writeFileSync(
   file,
   JSON.stringify(builds,null,2)
  );

  return record;

 }

};

export default AfriAPKBuilder;
