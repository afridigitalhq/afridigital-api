const nodes=new Map();

export class EdgeNodeManager {

 register(node){

  nodes.set(node.id,{
   ...node,
   status:"ONLINE"
  });

 }


 list(){

  return [...nodes.values()];

 }

}


export const edgeNodeManager =
new EdgeNodeManager();
