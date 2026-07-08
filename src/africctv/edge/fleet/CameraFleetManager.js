const fleets=new Map();

export class CameraFleetManager{

 add(site){

  fleets.set(site.id,site);
  return site;

 }


 all(){

  return [...fleets.values()];

 }

}


export const cameraFleetManager =
new CameraFleetManager();
