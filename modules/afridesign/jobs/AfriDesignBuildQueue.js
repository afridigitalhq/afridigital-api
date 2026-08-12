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
   prompt:job.prompt,
   jobId:job.id
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
   AfriBuildWorkspaceValidator.validate(
    workspaceFiles
   );

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
   type:"web_app",
   features:[
    "tasks",
    "completion_status",
    "categories",
    "mobile_ui"
   ],
   stack:[
    "React",
    "Vite",
    "CSS"
   ]
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
   receipt,
   certification,
   learning,
   evidence,
   status:"SUBMITTED"
  };

 }

};

export default AfriDesignBuildQueue;
