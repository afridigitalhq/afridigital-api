const AfriDebugWorkspaceManager={
  create(owner){
    return {id:"WS-"+Date.now(),owner,status:"WORKSPACE_CREATED"};
  }
};

export default AfriDebugWorkspaceManager;
