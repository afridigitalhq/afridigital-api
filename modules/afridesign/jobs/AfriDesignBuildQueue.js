import AfriDesignBuildJob from "./AfriDesignBuildJob.js";
import AfriDesignBuilderRuntime from "../providers/runtime/AfriDesignBuilderRuntime.js";
import AfriDesignArtifactManager from "../artifacts/AfriDesignArtifactManager.js";
import AfriDesignBuildReceipt from "../receipts/AfriDesignBuildReceipt.js";
import AfriDesignBuildCertification from "../validation/AfriDesignBuildCertification.js";
import AfriDesignEvidenceWriter from "../evidence/AfriDesignEvidenceWriter.js";
import AfriDesignWorkspaceManager from "../workspaces/AfriDesignWorkspaceManager.js";
import AfriDesignWorkspaceVersionManager from "../workspaces/AfriDesignWorkspaceVersionManager.js";

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
   result,
   receipt,
   certification,
   evidence,
   status:"SUBMITTED"
  };

 }

};

export default AfriDesignBuildQueue;
