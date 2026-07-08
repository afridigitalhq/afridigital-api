export class LifecycleStateEngine {

 constructor(){

  this.states = new Map();

 }


 create(device){

  const record = {
   id: device.id,
   state: "REGISTERED",
   history:[
    {
     state:"REGISTERED",
     timestamp:Date.now()
    }
   ]
  };

  this.states.set(device.id, record);

  return record;

 }


 transition(id,nextState){

  const device =
   this.states.get(id);

  if(!device){

   return null;

  }


  device.state = nextState;

  device.history.push({
   state:nextState,
   timestamp:Date.now()
  });


  return device;

 }


 get(id){

  return this.states.get(id);

 }


 list(){

  return [
   ...this.states.values()
  ];

 }


}


export const lifecycleStateEngine =
 new LifecycleStateEngine();
