const AfriBuildAPKValidator={

 validate(build={}){

  const checks={

   hasBuildId:Boolean(build.buildId),

   hasArtifact:Boolean(build.artifactId),

   hasProject:Boolean(build.projectId),

   compiled:
    build.steps?.includes("ANDROID_COMPILATION") || false,

   signed:
    build.steps?.includes("APK_SIGNING") || false

  };

  const passed =
   Object.values(checks)
   .every(Boolean);


  return {

   validationId:
    "apk_validation_"+Date.now(),

   buildId:
    build.buildId || null,

   checks,

   score:
    Object.values(checks)
    .filter(Boolean).length * 20,

   status:
    passed ? "APPROVED":"FAILED",

   createdAt:
    new Date().toISOString()

  };

 }

};

export default AfriBuildAPKValidator;
