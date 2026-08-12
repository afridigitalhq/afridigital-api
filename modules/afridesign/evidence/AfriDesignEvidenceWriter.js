const AfriDesignEvidenceWriter = {

 create(data={}){

  return {
   evidenceId:"evidence_"+Date.now(),
   component:"AfriDesign-AppBuilder-Pipeline",
   jobId:data.jobId,
   artifactId:data.artifactId,
   provider:data.provider,
   receiptId:data.receiptId,
   certificationId:data.certificationId,
   status:"RECORDED",
   timestamp:new Date().toISOString()
  };

 }

};

export default AfriDesignEvidenceWriter;
