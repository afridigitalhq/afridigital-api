const AfriDesignWorkspaceVersionManager = {

 create(workspace={}, changes={}){

  return {
   versionId:`version_${Date.now()}`,
   workspaceId:workspace.workspaceId,
   changes,
   status:"CREATED",
   createdAt:new Date().toISOString()
  };

 },

 history(workspaceId){

  return {
   workspaceId,
   versions:[]
  };

 }

};

export default AfriDesignWorkspaceVersionManager;
