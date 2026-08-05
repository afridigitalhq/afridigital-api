const CoreSnapshotEngine={
 create(target){
  return {target,snapshotId:"SNAP-"+Date.now(),status:"CREATED"};
 }
};

export default CoreSnapshotEngine;
