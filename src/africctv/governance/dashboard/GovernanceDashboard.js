export class GovernanceDashboard {

 status(){

  return {
   security:"READY",
   compliance:"READY",
   risk:"LOW"
  };

 }

}


export const governanceDashboard =
new GovernanceDashboard();
