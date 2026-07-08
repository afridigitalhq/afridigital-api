const devices=[];

export class CameraMarketplace {

 register(device){

  devices.push(device);

  return device;
 }


 list(){

  return devices;

 }

}


export const cameraMarketplace =
new CameraMarketplace();
