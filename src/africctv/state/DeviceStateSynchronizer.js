const devices=new Map();

export class DeviceStateSynchronizer{

 update(device){

  devices.set(device.id,{
   ...device,
   syncedAt:Date.now()
  });

 }

 get(id){

  return devices.get(id);

 }

 list(){

  return [...devices.values()];

 }

}

export const deviceStateSynchronizer =
new DeviceStateSynchronizer();
