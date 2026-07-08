const devices=new Map();

export class CameraIdentityManager{

 register(camera){

  devices.set(camera.id,{
   ...camera,
   identity:"REGISTERED"
  });

 }

 get(id){

  return devices.get(id);

 }

}

export const cameraIdentityManager =
new CameraIdentityManager();
