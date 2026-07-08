const alerts=[];

export class ThreatInvestigationDashboard{

 add(alert){

  alerts.push({
   ...alert,
   status:"OPEN"
  });

 }

 view(){

  return alerts;

 }

}

export const threatInvestigationDashboard =
new ThreatInvestigationDashboard();
