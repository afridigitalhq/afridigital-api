const AfriBuildAPKGenerator={

 async generate(project={}){

  return {

   apkId:
    "apk_"+Date.now(),

   projectId:
    project.projectId || null,

   application:
    project.name || "afribuild-app",

   packageName:
    project.packageName || "com.afridigital.app",

   version:
    project.version || "1.0.0",

   artifact:{
    type:"APK",
    size:"PENDING",
    file:null
   },

   status:"APK_BUILD_QUEUED",

   createdAt:
    new Date().toISOString()

  };

 }

};

export default AfriBuildAPKGenerator;
