const AfriDesignArtifactLifecycle = {

 create(job={}){

  return {
   artifactId:"artifact_"+Date.now(),
   jobId:job.id,
   provider:job.provider,
   prompt:job.prompt,
   status:"GENERATED",
   stages:[
    "QUEUED",
    "BUILDING",
    "GENERATED",
    "PREVIEW_READY",
    "APPROVED",
    "EXPORTED"
   ],
   createdAt:new Date().toISOString()
  };

 }

};

export default AfriDesignArtifactLifecycle;
