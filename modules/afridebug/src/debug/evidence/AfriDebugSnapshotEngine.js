const snapshots = [];

const AfriDebugSnapshotEngine = {

  capture(input = {}) {

    const snapshot = {
      id:`SNAPSHOT-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,
      caseId:input.caseId || null,
      type:input.type || "BEFORE",
      repository:input.repository || null,

      files:input.files || [],
      runtime:input.runtime || {},
      dependencies:input.dependencies || [],
      tests:input.tests || [],

      createdAt:Date.now()
    };

    snapshots.push(snapshot);

    return snapshot;
  },


  compare(beforeId, afterId) {

    const before = snapshots.find(x=>x.id===beforeId);
    const after = snapshots.find(x=>x.id===afterId);

    if(!before || !after){
      return {
        success:false,
        reason:"SNAPSHOT_NOT_FOUND"
      };
    }

    return {
      success:true,
      comparison:{
        caseId:after.caseId,
        before:{
          files:before.files,
          tests:before.tests
        },
        after:{
          files:after.files,
          tests:after.tests
        },
        changedFiles:
          after.files.filter(
            file=>!before.files.includes(file)
          )
      }
    };
  },


  list(){
    return snapshots;
  },


  stats(){
    return {
      snapshots:snapshots.length
    };
  }

};

export default AfriDebugSnapshotEngine;
