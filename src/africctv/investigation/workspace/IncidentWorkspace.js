const incidents=[];

export class IncidentWorkspace{

 create(incident){

  incidents.push({
   ...incident,
   status:"OPEN"
  });

 }

 list(){

  return incidents;

 }

}

export const incidentWorkspace =
new IncidentWorkspace();
