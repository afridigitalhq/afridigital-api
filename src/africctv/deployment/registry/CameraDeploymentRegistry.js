const cameras=new Map();


export class CameraDeploymentRegistry {

 register(camera){

  cameras.set(camera.id,camera);

  return camera;
 }


 list(){
  return [...cameras.values()];
 }

}


export const cameraDeploymentRegistry =
new CameraDeploymentRegistry();
