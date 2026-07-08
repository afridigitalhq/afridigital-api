const nodes=[];

export class EdgeCameraNodeManager{

 register(node){

  nodes.push(node);

 }

 list(){

  return nodes;

 }

}

export const edgeCameraNodeManager =
new EdgeCameraNodeManager();
