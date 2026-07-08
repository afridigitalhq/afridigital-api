const cameras = new Map();

export class CameraAuth {

  register(camera){
    cameras.set(camera.id,{
      id:camera.id,
      token:camera.token,
      authenticated:false
    });

    return cameras.get(camera.id);
  }


  authenticate(id,token){

    const camera=cameras.get(id);

    if(!camera) return false;

    if(camera.token!==token){
      return false;
    }

    camera.authenticated=true;

    return true;
  }


  status(id){
    return cameras.get(id)||null;
  }

}


export const cameraAuth =
new CameraAuth();
