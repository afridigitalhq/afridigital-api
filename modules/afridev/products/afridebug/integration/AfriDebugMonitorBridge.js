const AfriDebugMonitorBridge={
  execute(caseId){
    return {caseId,target:"AfriMonitor",status:"MONITORING_STARTED"};
  }
};

export default AfriDebugMonitorBridge;
