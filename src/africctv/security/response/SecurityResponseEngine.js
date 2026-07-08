export class SecurityResponseEngine {

 respond(threat){

  return {
   action: threat.level==="HIGH"
    ? "ALERT"
    : "MONITOR",
   status:"EXECUTED"
  };

 }

}


export const securityResponseEngine =
new SecurityResponseEngine();
