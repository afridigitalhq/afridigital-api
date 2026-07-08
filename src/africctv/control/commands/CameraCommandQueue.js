const queue=[];

export class CameraCommandQueue{

 push(command){

  queue.push({
   ...command,
   status:"PENDING",
   createdAt:Date.now()
  });

 }

 process(){

  return queue.map(item=>({
   ...item,
   status:"EXECUTED"
  }));

 }

 list(){

  return queue;

 }

}


export const cameraCommandQueue =
new CameraCommandQueue();
