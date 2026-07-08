const registry=[];

export class CameraNodeRegistry{

 add(node){

  registry.push(node);
  return node;

 }


 list(){

  return registry;

 }

}


export const cameraNodeRegistry =
new CameraNodeRegistry();
