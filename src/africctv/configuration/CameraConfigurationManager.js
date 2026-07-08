const configs=new Map();

export class CameraConfigurationManager{

 save(id,config){

  configs.set(id,config);

 }

 load(id){

  return configs.get(id);

 }

}

export const cameraConfigurationManager =
new CameraConfigurationManager();
