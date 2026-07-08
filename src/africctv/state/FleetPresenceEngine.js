export class FleetPresenceEngine{

 classify(device){

  if(device.session==="ACTIVE"){
   return "ONLINE";
  }

  if(device.cause==="SERVICE_LIMITED"){
   return "IDLE";
  }

  if(device.reachable===false){
   return "OFFLINE";
  }

  return "IDLE";

 }

}

export const fleetPresenceEngine =
new FleetPresenceEngine();
