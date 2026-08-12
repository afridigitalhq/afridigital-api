const AfriBuildVersionRegistry={

 register(app={}){

  return {
   versionId:"version_"+Date.now(),
   projectId:app.projectId || null,
   application:app.application || "AfriBuild App",
   version:app.version || "1.0.0",

   release:{
    major:app.major || 1,
    minor:app.minor || 0,
    patch:app.patch || 0
   },

   androidCompatibility:{
    minimumSdk:app.minimumSdk || "Android 8",
    targetSdk:app.targetSdk || "Latest"
   },

   status:"VERSION_REGISTERED",
   createdAt:new Date().toISOString()
  };

 }

};

export default AfriBuildVersionRegistry;
