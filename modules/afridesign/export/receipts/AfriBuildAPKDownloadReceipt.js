const AfriBuildAPKDownloadReceipt={

 create(download={}){

  return {
   receiptId:"apk_receipt_"+Date.now(),
   downloadId:download.downloadId || null,
   apkId:download.apkId || null,
   artifactId:download.artifactId || null,
   projectId:download.projectId || null,
   application:download.application || "AfriBuild App",
   version:download.version || "1.0.0",
   delivery:{
    method:"APK_DOWNLOAD",
    status:"DELIVERED"
   },
   checksum:download.checksum || "PENDING",
   createdAt:new Date().toISOString()
  };

 }

};

export default AfriBuildAPKDownloadReceipt;
