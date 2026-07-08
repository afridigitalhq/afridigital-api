const nodes=new Map();

export class EdgeCameraRuntime{

 register(node){

  nodes.set(node.id,{
   ...node,
   status:"ONLINE"
  });

  return nodes.get(node.id);

 }


 status(){

  return [...nodes.values()];

 }

}


export const edgeCameraRuntime =
new EdgeCameraRuntime();
