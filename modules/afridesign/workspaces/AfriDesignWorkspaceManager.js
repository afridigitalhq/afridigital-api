const AfriDesignWorkspaceManager = {

 create(job={}){

  return {
   workspaceId:`workspace_${Date.now()}`,
   jobId:job.id || null,
   provider:job.provider || null,
   prompt:job.prompt || "",
   status:"CREATED",
   createdAt:new Date().toISOString()
  };

 },

 history(workspace){

  return {
   workspaceId:workspace.workspaceId,
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
