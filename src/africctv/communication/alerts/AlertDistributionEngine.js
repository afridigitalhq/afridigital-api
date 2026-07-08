const alerts=[];

export class AlertDistributionEngine{

 send(alert){

  alerts.push({
   ...alert,
   status:"DELIVERED"
  });

 }

 list(){

  return alerts;

 }

}


export const alertDistributionEngine =
new AlertDistributionEngine();
