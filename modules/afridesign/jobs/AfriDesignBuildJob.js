const AfriDesignBuildJob = {
  create(request={}) {
    return {
      id:"build_"+Date.now(),
      userId:request.userId || "guest",
      provider:request.provider || "mock",
      prompt:request.prompt || "",
      name:request.name || "afribuild-app",
      status:"QUEUED",
      createdAt:new Date().toISOString()
    };
  }
};

export default AfriDesignBuildJob;
