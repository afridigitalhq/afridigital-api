export class CameraOperationsCenter{

 constructor(){
  this.metrics={
   users:0,
   online:0,
   offline:0,
   idle:0
  };
 }

 update(metrics){

  this.metrics=metrics;

 }

 status(){

  return this.metrics;

 }

}

export const cameraOperationsCenter =
new CameraOperationsCenter();
