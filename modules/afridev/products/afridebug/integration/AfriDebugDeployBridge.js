const AfriDebugDeployBridge={
  execute(caseId){
    return {caseId,target:"AfriDeploy",status:"DEPLOY_REQUESTED"};
  }
};

export default AfriDebugDeployBridge;
