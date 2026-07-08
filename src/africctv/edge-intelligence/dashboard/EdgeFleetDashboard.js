export class EdgeFleetDashboard{

 view(data){

  return {
   nodes:data.nodes,
   cameras:data.cameras,
   status:data.status
  };

 }

}

export const edgeFleetDashboard =
new EdgeFleetDashboard();
