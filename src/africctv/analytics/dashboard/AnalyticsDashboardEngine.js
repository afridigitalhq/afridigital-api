export class AnalyticsDashboardEngine{

 snapshot(){

  return {
   cameras:3,
   status:"LIVE",
   intelligence:"ACTIVE"
  };

 }

}


export const analyticsDashboardEngine =
new AnalyticsDashboardEngine();
