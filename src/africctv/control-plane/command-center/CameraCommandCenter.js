export class CameraCommandCenter{

 overview(fleet){

  return {
   total:fleet.total,
   online:fleet.online,
   offline:fleet.offline,
   idle:fleet.idle
  };

 }

}

export const cameraCommandCenter =
new CameraCommandCenter();
