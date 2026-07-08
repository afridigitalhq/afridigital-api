export class EdgeCloudSyncBridge{

 sync(data){

  return {
   source:"EDGE",
   destination:"CLOUD",
   status:"SYNCED",
   data
  };

 }

}


export const edgeCloudSyncBridge =
new EdgeCloudSyncBridge();
