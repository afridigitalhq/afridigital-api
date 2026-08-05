const AfriDebugSnapshot = {

  create(target={}){

    return {
      snapshot:true,
      snapshotId:`snapshot-${Date.now()}`,
      target,
      createdAt:new Date().toISOString(),
      status:"CREATED"
    };

  },

  restore(snapshot){

    return {
      rollback:true,
      snapshotId:snapshot?.snapshotId,
      restoredAt:new Date().toISOString(),
      status:"RESTORE_READY"
    };

  }

};

export default AfriDebugSnapshot;
