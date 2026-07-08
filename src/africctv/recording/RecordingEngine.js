export class RecordingEngine {

 constructor(){
  this.records=[];
 }

 record(camera,event="FRAME"){
  const item={
   cameraId:camera,
   event,
   timestamp:Date.now()
  };

  this.records.push(item);

  return item;
 }

 list(){
  return this.records;
 }

}

export const recordingEngine =
new RecordingEngine();
