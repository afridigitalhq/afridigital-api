export class PredictiveCameraAI {

 predict(data){

  return {
   prediction:"ANOMALY_SCAN_COMPLETE",
   confidence:0.95,
   cameraId:data.cameraId
  };

 }

}


export const predictiveCameraAI =
new PredictiveCameraAI();
