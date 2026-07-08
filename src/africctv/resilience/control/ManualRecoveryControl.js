const requests=[];

export class ManualRecoveryControl{

 request(action){

  requests.push({
   action,
   approval:"REQUIRED"
  });

 }

 list(){

  return requests;

 }

}


export const manualRecoveryControl =
new ManualRecoveryControl();
