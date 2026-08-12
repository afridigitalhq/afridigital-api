const AfriBuildAPKBuildRunner={

 async run(artifact={}){

  return {

   buildId:
    "apk_build_"+Date.now(),

   artifactId:
    artifact.artifactId || null,

   projectId:
    artifact.projectId || null,

   command:
    "ANDROID_BUILD_PIPELINE",

   steps:[
    "SOURCE_PACKAGING",
    "DEPENDENCY_CHECK",
    "ANDROID_COMPILATION",
    "APK_SIGNING",
    "ARTIFACT_GENERATION"
   ],

   output:{
    file:artifact.file || null,
    size:"SIMULATED"
   },

   status:"APK_BUILT",

   createdAt:
    new Date().toISOString()

  };

 }

};

export default AfriBuildAPKBuildRunner;
