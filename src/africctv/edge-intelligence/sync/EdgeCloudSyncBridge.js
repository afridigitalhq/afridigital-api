export class EdgeCloudSyncBridge{

 sync(node){

  return {
   node,
   status:"SYNCED"
  };

 }

}

export const edgeCloudSyncBridge =
new EdgeCloudSyncBridge();
