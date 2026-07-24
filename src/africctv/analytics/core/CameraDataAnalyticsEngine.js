const metrics=[];

export class CameraDataAnalyticsEngine{

 record(data){

  metrics.push({
   ...data,
   timestamp:Date.now()
  });

  return data;

 }


 report(){

  return metrics;

 }

}


export const cameraDataAnalyticsEngine =
new CameraDataAnalyticsEngine();
