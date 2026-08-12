import fs from "fs";
import path from "path";

const AfriBuildAPKStorageManager={

 store(apk={}){

  const dir="modules/afridesign/.artifacts";

  if(!fs.existsSync(dir)){
   fs.mkdirSync(dir,{recursive:true});
  }

  const filePath =
   path.join(
    dir,
    `${apk.application || "AfriBuild"}-${apk.version || "1.0.0"}.apk`
   );

  if(!fs.existsSync(filePath)){
   fs.writeFileSync(
    filePath,
    "AFRIBUILD APK ARTIFACT PLACEHOLDER"
   );
  }

  const stat=fs.statSync(filePath);

  return {
   storageId:"storage_"+Date.now(),
   file:filePath,
   size:stat.size,
   mime:"application/vnd.android.package-archive",
   status:"STORED",
   createdAt:new Date().toISOString()
  };

 }

};

export default AfriBuildAPKStorageManager;
