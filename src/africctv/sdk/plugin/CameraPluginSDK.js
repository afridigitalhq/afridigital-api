const plugins=new Map();

export class CameraPluginSDK{

 register(plugin){

  plugins.set(plugin.id,plugin);

 }

 get(id){

  return plugins.get(id);

 }

 list(){

  return [...plugins.values()];

 }

}

export const cameraPluginSDK =
new CameraPluginSDK();
