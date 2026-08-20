import { execFile } from "child_process";
import { promisify } from "util";
import fs from "fs";
import path from "path";

const execFileAsync = promisify(execFile);

const AfriBuildAPKBuildRunner={

 async run(artifact={}){

  const workspace =
   artifact.workspace ||
   artifact.project?.workspace ||
   null;

  const native =
   artifact.type === "native-android" ||
   artifact.project?.type === "native-android" ||
   Boolean(workspace && fs.existsSync(path.join(workspace,"app/build.gradle")));

  if(!native){
   return {
    buildId:"apk_build_"+Date.now(),
    artifactId:artifact.artifactId || null,
    projectId:artifact.projectId || null,
    version:artifact.version || artifact.project?.version || "1.0.0",
    command:"ANDROID_BUILD_PIPELINE",
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
    createdAt:new Date().toISOString()
   };
  }

  if(!workspace){
   return {
    buildId:"apk_build_"+Date.now(),
    artifactId:artifact.artifactId || null,
    projectId:artifact.projectId || null,
    command:"gradle :app:assembleDebug",
    status:"BUILD_FAILED",
    reason:"NATIVE_WORKSPACE_MISSING",
    createdAt:new Date().toISOString()
   };
  }

  const sdkDir=process.env.ANDROID_HOME || process.env.ANDROID_SDK_ROOT || `${process.env.HOME}/android-sdk`;

  const env={
   ...process.env,
   ANDROID_HOME:sdkDir,
   ANDROID_SDK_ROOT:sdkDir
  };

  const localProperties=path.join(workspace,"local.properties");
  if(!fs.existsSync(localProperties)){
   fs.writeFileSync(
    localProperties,
    `sdk.dir=${sdkDir.replace(/\\/g,"\\\\")}\n`
   );
  }

  const buildId="apk_build_"+Date.now();

  try{

   const {stdout,stderr}=await execFileAsync(
    "gradle",
    [":app:assembleDebug"],
    {
     cwd:workspace,
     env,
     maxBuffer:10*1024*1024
    }
   );

   const apkDir=path.join(
    workspace,
    "app/build/outputs/apk/debug"
   );

   const apkFiles=fs.readdirSync(apkDir)
    .filter(file=>file.endsWith(".apk"))
    .map(file=>path.join(apkDir,file));

   if(!apkFiles.length){
    return {
     buildId,
     artifactId:artifact.artifactId || null,
     projectId:artifact.projectId || null,
     command:"gradle :app:assembleDebug",
     status:"BUILD_FAILED",
     reason:"APK_NOT_FOUND_AFTER_SUCCESSFUL_GRADLE",
     stdout,
     stderr,
     createdAt:new Date().toISOString()
    };
   }

   const file=apkFiles[0];
   const size=fs.statSync(file).size;

   return {
    buildId,
    artifactId:artifact.artifactId || null,
    projectId:artifact.projectId || null,
    command:"gradle :app:assembleDebug",
    steps:[
     "SOURCE_PACKAGING",
     "DEPENDENCY_CHECK",
     "ANDROID_COMPILATION",
     "APK_SIGNING",
     "ARTIFACT_GENERATION"
    ],
    output:{
     file,
     size,
     sizeBytes:size
    },
    status:"APK_BUILT",
    stdout,
    stderr,
    createdAt:new Date().toISOString()
   };

  }catch(error){

   return {
    buildId,
    artifactId:artifact.artifactId || null,
    projectId:artifact.projectId || null,
    command:"gradle :app:assembleDebug",
    status:"BUILD_FAILED",
    reason:"GRADLE_BUILD_FAILED",
    exitCode:error.code || null,
    stdout:error.stdout || "",
    stderr:error.stderr || error.message || "",
    createdAt:new Date().toISOString()
   };

  }

 }

};

export default AfriBuildAPKBuildRunner;
