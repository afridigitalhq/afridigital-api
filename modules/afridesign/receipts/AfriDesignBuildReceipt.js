const AfriDesignBuildReceipt = {

 create(data={}){

  return {
   receiptId:"receipt_"+Date.now(),
   jobId:data.jobId,
   artifactId:data.artifactId,
   provider:data.provider,
   status:data.status || "SUBMITTED",
   verified:true,
   timestamp:new Date().toISOString()
  };

 }

};

export default AfriDesignBuildReceipt;
