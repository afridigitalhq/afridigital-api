import AfriBuildVersionResolver from "../versioning/AfriBuildVersionResolver.js";

const AfriDesignBuildJob = {
  create(request={}) {
    return {
      id:"build_"+Date.now(),
      userId:request.userId || "guest",
      provider:request.provider || ((request.type || request.buildType) === "native_android" || (request.type || request.buildType) === "native-android" ? "native_android" : "mock"),
        type:request.type || request.buildType || "app_builder",
      prompt:request.prompt || "",
      name:request.name || "afribuild-app",
      version:AfriBuildVersionResolver.resolve({ ...request, application:request.name }),
      status:"QUEUED",
      createdAt:new Date().toISOString()
    };
  }
};

export default AfriDesignBuildJob;
