import AfriArtifactRegistry from "./AfriArtifactRegistry.js";

const AfriWebArtifactEngine={

 deploy(request={}){

  const url=
   "https://afribuild-app-"+Date.now()+".onrender.com";

  return AfriArtifactRegistry.register({
   jobId:request.jobId,
   userId:request.userId,
   product:"AfriBuild",
   name:request.name,
   type:"WEBVIEW_APP",
   version:request.version || "1.0.0",
   url
  });

 }

};

export default AfriWebArtifactEngine;
