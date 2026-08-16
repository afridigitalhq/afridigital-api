import fs from "fs";
import path from "path";
import crypto from "crypto";

const AfriBuildAPKStorageManager={
 store(apk={}){
  const dir="modules/afridesign/.artifacts";
  if(!fs.existsSync(dir)) fs.mkdirSync(dir,{recursive:true});
  const source=apk.file || null;
  if(!source || !fs.existsSync(source)) return {storageId:"storage_"+Date.now(),file:null,size:0,checksum:null,mime:"application/vnd.android.package-archive",status:"STORAGE_FAILED",reason:"APK_SOURCE_NOT_FOUND",createdAt:new Date().toISOString()};
  const application=apk.application || "AfriBuild";
  const version=apk.version || "1.0.0";
  const filePath=path.join(dir,application+"-"+version+".apk");
  if(path.resolve(source)!==path.resolve(filePath)) fs.copyFileSync(source,filePath);
  const stat=fs.statSync(filePath);
  const checksum=crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
  return {storageId:"storage_"+Date.now(),file:filePath,size:stat.size,checksum,mime:"application/vnd.android.package-archive",status:"STORED",createdAt:new Date().toISOString()};
 }
};
export default AfriBuildAPKStorageManager;
