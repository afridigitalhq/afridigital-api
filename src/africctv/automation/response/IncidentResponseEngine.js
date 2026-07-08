const actions=[];

export class IncidentResponseEngine {

 respond(event){

  const action={
   event:event.type,
   camera:event.cameraId,
   response:event.severity==="HIGH"
    ? "ESCALATE"
    : "MONITOR",
   timestamp:Date.now()
  };

  actions.push(action);

  return action;
 }


 history(){
  return actions;
 }

}


export const incidentResponseEngine =
new IncidentResponseEngine();
