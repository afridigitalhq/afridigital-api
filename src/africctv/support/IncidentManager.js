const incidents=[];

export class IncidentManager {

 create(event){

  incidents.push({
   event,
   status:"OPEN"
  });

 }


 list(){

  return incidents;

 }

}


export const incidentManager =
new IncidentManager();
