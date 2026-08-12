const AfriDesignBuildJob = {

 create(request={}){

  return {
   id:"build_"+Date.now(),
   provider:request.provider || "mock",
   prompt:request.prompt || "",
   status:"QUEUED",
   createdAt:new Date().toISOString()
  };

 }

};

export default AfriDesignBuildJob;
