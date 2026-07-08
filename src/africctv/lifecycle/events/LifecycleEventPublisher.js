export class LifecycleEventPublisher {

 constructor(){

  this.events = [];

 }


 publish(event){

  const record = {

   id:Date.now(),

   type:event.type,

   deviceId:event.deviceId,

   payload:event.payload || {},

   timestamp:Date.now()

  };


  this.events.push(record);


  return record;

 }


 deviceRegistered(device){

  return this.publish({

   type:"DEVICE_REGISTERED",

   deviceId:device.id,

   payload:device

  });

 }


 stateChanged(deviceId,state){

  return this.publish({

   type:"LIFECYCLE_STATE_CHANGED",

   deviceId,

   payload:{
    state
   }

  });

 }


 list(){

  return this.events;

 }

}


export const lifecycleEventPublisher =
 new LifecycleEventPublisher();
