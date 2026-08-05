const AfriDebugRollbackBridge={
  execute(snapshotId){
    return {snapshotId,target:"Rollback",status:"ROLLBACK_READY"};
  }
};

export default AfriDebugRollbackBridge;
