import AfriDesignArtifactLifecycle from "./AfriDesignArtifactLifecycle.js";

const artifacts = [];

const AfriDesignArtifactManager = {

  create(request={}) {
    const artifact = {
      id:"artifact_"+Date.now(),
      jobId:request.jobId || null,
      userId:request.userId || "guest",
      projectId:request.projectId || null,
      provider:request.provider || null,
      prompt:request.prompt || "",
      name:request.name || "Untitled",
      status:AfriDesignArtifactLifecycle.CREATED,
      createdAt:new Date().toISOString()
    };

    artifacts.push(artifact);
    return artifact;
  },

  update(id,status) {
    const artifact = artifacts.find(a=>a.id===id);

    if(!artifact) {
      return {
        status:"FAILED",
        reason:"ARTIFACT_NOT_FOUND"
      };
    }

    artifact.status=status;
    return artifact;
  },

  list() {
    return artifacts;
  },

  listByUser(userId) {
    return artifacts.filter(a=>a.userId === userId);
  }

};

export default AfriDesignArtifactManager;
