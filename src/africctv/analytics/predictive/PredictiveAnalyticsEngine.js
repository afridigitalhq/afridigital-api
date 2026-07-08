export class PredictiveAnalyticsEngine{

 predict(data){

  return {
   source:data,
   prediction:"STABLE"
  };

 }

}


export const predictiveAnalyticsEngine =
new PredictiveAnalyticsEngine();
