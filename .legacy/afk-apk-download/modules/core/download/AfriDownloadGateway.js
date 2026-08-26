import fs from "fs";

const file="modules/core/.data/afri-download-links.json";

function load(){
 if(!fs.existsSync(file)) return [];
 return JSON.parse(fs.readFileSync(file));
}

const AfriDownloadGateway={

 create(request={}){

  const links=load();

  const record={
   downloadId:"download_"+Date.now(),
   buildId:request.buildId,
   artifactId:request.artifactId,
   userId:request.userId,
   appName:request.appName,
   type:request.type || "APK",
   url:
    "https://apps.afridigital.app/download/"+request.appName+".apk",
   status:"DOWNLOAD_READY",
   createdAt:new Date().toISOString()
  };

  links.push(record);

  fs.writeFileSync(
   file,
   JSON.stringify(links,null,2)
  );

  return record;

 }

};

export default AfriDownloadGateway;
