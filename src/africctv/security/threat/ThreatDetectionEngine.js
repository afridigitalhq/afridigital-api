const threats=[];

export class ThreatDetectionEngine {

 analyze(event){

  const result={
   cameraId:event.cameraId,
   threat:event.type==="intrusion",
   level:event.type==="intrusion"?"HIGH":"NORMAL",
   timestamp:Date.now()
  };

  threats.push(result);

  return result;
 }


 history(){
  return threats;
 }

}

export const threatDetectionEngine =
new ThreatDetectionEngine();
