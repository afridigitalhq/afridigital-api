const AfriBuildAPKDownloadManager={

 create(apk={}){

  return {
   downloadId:"download_"+Date.now(),
   apkId:apk.apkId || null,
   artifactId:apk.artifactId || null,
   projectId:apk.projectId || null,
   application:apk.application || "AfriBuild App",
   version:apk.version || "1.0.0",
   file:apk.file || null,
   checksum:"PENDING",
   status:"DOWNLOAD_READY",
   createdAt:new Date().toISOString()
  };

 }

};

export default AfriBuildAPKDownloadManager;
