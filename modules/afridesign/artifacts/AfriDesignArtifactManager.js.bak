import AfriDesignArtifactLifecycle from "./AfriDesignArtifactLifecycle.js";

const artifacts = [];

const AfriDesignArtifactManager = {

 create(request={}){

  const artifact = {
   id:"artifact_"+Date.now(),
   jobId:request.jobId,
   provider:request.provider,
   prompt:request.prompt,
   status:AfriDesignArtifactLifecycle.CREATED,
   createdAt:new Date().toISOString()
  };

  artifacts.push(artifact);

  return artifact;

 },

 update(id,status){

  const artifact = artifacts.find(a=>a.id===id);

  if(!artifact){
   return {
    status:"FAILED",
    reason:"ARTIFACT_NOT_FOUND"
   };
  }

  artifact.status=status;

  return artifact;

 },

 list(){

  return artifacts;

 }

};

export default AfriDesignArtifactManager;
