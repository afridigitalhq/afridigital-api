const incidents=[];

export class IncidentWorkspace{

 create(incident){

  incidents.push({
   ...incident,
   state:"OPEN"
  });

 }

 list(){

  return incidents;

 }

}


export const incidentWorkspace =
new IncidentWorkspace();
