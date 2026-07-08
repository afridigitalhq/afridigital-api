const fleet=new Map();

export class CameraFleetManager {

 register(camera){

  fleet.set(camera.id,{
   ...camera,
   region:camera.region || "GLOBAL",
   status:"ACTIVE"
  });

  return fleet.get(camera.id);
 }


 list(){

  return [...fleet.values()];

 }

}


export const cameraFleetManager =
new CameraFleetManager();
