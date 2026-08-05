const AfriDebugCaseManager={
  create(project){
    return {
      id:"AFD-"+Date.now(),
      project,
      status:"INVESTIGATION_STARTED"
    };
  }
};

export default AfriDebugCaseManager;
