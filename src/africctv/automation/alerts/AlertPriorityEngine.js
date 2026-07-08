export class AlertPriorityEngine {

 prioritize(alert){

  return {
   type:alert.type,
   priority:
    alert.severity==="HIGH"
     ? "CRITICAL"
     : "NORMAL"
  };

 }

}


export const alertPriorityEngine =
new AlertPriorityEngine();
