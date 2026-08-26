import AfriDesignBuildJob from "./AfriDesignBuildJob.js";
import AfriDesignBuilderRuntime from "../providers/runtime/AfriDesignBuilderRuntime.js";
import AfriDesignArtifactManager from "../artifacts/AfriDesignArtifactManager.js";
import AfriDesignBuildReceipt from "../receipts/AfriDesignBuildReceipt.js";
import AfriDesignBuildCertification from "../validation/AfriDesignBuildCertification.js";
import AfriDesignEvidenceWriter from "../evidence/AfriDesignEvidenceWriter.js";
import AfriDesignWorkspaceManager from "../workspaces/AfriDesignWorkspaceManager.js";
import AfriDesignWorkspaceVersionManager from "../workspaces/AfriDesignWorkspaceVersionManager.js";
import AfriBuildProjectAssembler from "../generator/AfriBuildProjectAssembler.js";
import AfriBuildWorkspaceWriter from "../generator/AfriBuildWorkspaceWriter.js";
import AfriBuildWorkspaceValidator from "../validation/AfriBuildWorkspaceValidator.js";
import AfriBuildLearningEngine from "../learning/AfriBuildLearningEngine.js";
import AfriBuildAPKBuildRunner from "../export/builders/AfriBuildAPKBuildRunner.js";
import AfriBuildAPKStorageManager from "../export/delivery/AfriBuildAPKStorageManager.js";
import AfriBuildAPKDownloadManager from "../export/download/AfriBuildAPKDownloadManager.js";
import AfriBuildDownloadGateway from "../export/delivery/AfriBuildDownloadGateway.js";

const AfriDesignBuildQueue = {

 async submit(request={}){

  const job = AfriDesignBuildJob.create(request);

  const workspace = AfriDesignWorkspaceManager.create({
   id:job.id,
   provider:job.provider,
   prompt:job.prompt
  });

  const version = AfriDesignWorkspaceVersionManager.create(
   workspace,
   {
    prompt:job.prompt,
    provider:job.provider
   }
  );

  const artifact = AfriDesignArtifactManager.create({
   jobId:job.id,
   provider:job.provider,
   prompt:job.prompt
  });

  const result = await AfriDesignBuilderRuntime.generate({
   provider:job.provider,
     type:job.type,
     buildType:job.type,
   prompt:job.prompt,
   jobId:job.id,
   version:job.version
  });

  const project =
   AfriBuildProjectAssembler.assemble(
    result.project || {
     name:"afribuild-generated-app",
     files:{}
    }
   );

  const workspaceFiles =
   AfriBuildWorkspaceWriter.write(project);

  const validation =
   AfriBuildWorkspaceValidator.validate({
    ...workspaceFiles,
    type:project.type || result.buildType || "web_app"
   });


    let apkBuild = null;
    let apkStorage = null;
    let apkDownload = null;
    let downloadGateway = null;

    if(
     validation.status === "VALIDATED" &&
     (project.type === "native-android" || result.buildType === "native-android" || result.buildType === "native_android" || job.type === "native_android" || job.type === "native-android")
    ){
     apkBuild = await AfriBuildAPKBuildRunner.run({
      ...project,
      type:"native-android",
      workspace:workspaceFiles.workspace
     });

     if(apkBuild.status === "APK_BUILT" && apkBuild.output?.file){
      artifact.file = apkBuild.output.file;
      artifact.buildId = apkBuild.buildId;
      artifact.status = "BUILT";

      apkStorage = AfriBuildAPKStorageManager.store({
       file:apkBuild.output.file,
       application:project.name || "AfriBuild",
       version:project.version || job.version || "1.0.0",
       artifactId:artifact.id,
       projectId:project.projectId || null
      });

      apkDownload = AfriBuildAPKDownloadManager.create({
       file:apkStorage.file,
       size:apkStorage.size,
       checksum:apkStorage.checksum,
       apkId:apkBuild.apkId || null,
       artifactId:artifact.id,
       projectId:project.projectId || null,
       application:project.name || "AfriBuild",
       version:project.version || job.version || "1.0.0"
      });

      downloadGateway = AfriBuildDownloadGateway.create({
       apkId:apkDownload.apkId,
       artifactId:apkDownload.artifactId,
       file:apkDownload.file
      });
     }
    }

  const receipt = AfriDesignBuildReceipt.create({
   jobId:job.id,
   artifactId:artifact.id,
   provider:job.provider,
   status:result.status
  });

  const certification = AfriDesignBuildCertification.certify({
   jobId:job.id,
   artifactId:artifact.id,
   provider:job.provider
  });

  const learning = AfriBuildLearningEngine.learn({
   status:certification.status,
   artifactId:artifact.id,
   provider:job.provider,
   type:result.buildType || project.type || "web_app",
   features:[
    "tasks",
    "completion_status",
    "categories",
    "mobile_ui"
   ],
   stack:
    result.language === "kotlin"
     ? ["Kotlin","Android","Gradle"]
     : ["React","Vite","CSS"]
  });

  const evidence = AfriDesignEvidenceWriter.create({
   jobId:job.id,
   artifactId:artifact.id,
   provider:job.provider,
   receiptId:receipt.receiptId,
   certificationId:certification.certificationId
  });

  return {
   job,
   workspace,
   version,
   artifact,
   project,
   workspaceFiles,
   validation,
   result,
     apkBuild,
   apkStorage,
   apkDownload,
   downloadGateway,
   receipt,
   certification,
   learning,
   evidence,
   status:"SUBMITTED"
  };

 }

};

export default AfriDesignBuildQueue;
