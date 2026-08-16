import fs from "fs";
import crypto from "crypto";

const AfriBuildAPKDownloadManager={
 create(apk={}){
  const file=apk.file || null;
  const checksum=apk.checksum || (file && fs.existsSync(file) ? crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex") : null);
  return {downloadId:"download_"+Date.now(),apkId:apk.apkId || null,artifactId:apk.artifactId || null,projectId:apk.projectId || null,application:apk.application || "AfriBuild App",version:apk.version || "1.0.0",file,size:apk.size || (file && fs.existsSync(file) ? fs.statSync(file).size : 0),checksum,status:checksum ? "DOWNLOAD_READY" : "DOWNLOAD_BLOCKED",createdAt:new Date().toISOString()};
 }
};
export default AfriBuildAPKDownloadManager;
