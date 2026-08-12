const AfriBuildAPKArtifactManager={

 create(build={}){

  return {

   artifactId:
    "apk_artifact_"+Date.now(),

   apkId:
    build.apkId || null,

   projectId:
    build.projectId || null,

   file:
    `modules/afridesign/.artifacts/${build.application || "app"}-${build.version || "1.0.0"}.apk`,

   type:"APK",

   status:"ARTIFACT_CREATED",

   createdAt:
    new Date().toISOString()

  };

 }

};

export default AfriBuildAPKArtifactManager;
