const AfriDesignWorkspaceManager = {

  create(job={}) {
    return {
      workspaceId:`workspace_${Date.now()}`,
      jobId:job.id || null,
      userId:job.userId || "guest",
      provider:job.provider || null,
      prompt:job.prompt || "",
      projectId:job.projectId || null,
      status:"CREATED",
      createdAt:new Date().toISOString()
    };
  },

  history(workspace) {
    return {
      workspaceId:workspace.workspaceId,
      userId:workspace.userId || "guest",
      events:[
        {
          event:"WORKSPACE_CREATED",
          timestamp:workspace.createdAt
        }
      ]
    };
  }

};

export default AfriDesignWorkspaceManager;
