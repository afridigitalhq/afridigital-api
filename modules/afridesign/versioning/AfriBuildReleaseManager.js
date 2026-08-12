const AfriBuildReleaseManager={

 release(version={}){

  return {
   releaseId:"release_"+Date.now(),

   versionId:version.versionId || null,

   projectId:version.projectId || null,

   application:version.application || "AfriBuild App",

   version:version.version || "1.0.0",

   releaseNotes:version.notes || [
    "Initial AfriBuild release",
    "Generated with AfriBuild Engine"
   ],

   artifacts:{
    apk:version.apk || null,
    web:version.web || null
   },

   status:"RELEASE_PUBLISHED",

   createdAt:new Date().toISOString()
  };

 }

};

export default AfriBuildReleaseManager;
