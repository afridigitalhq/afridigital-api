export class VisionIntelligence {

 analyze(event){

  return {
   source:"africctv",
   analysis:"READY",
   event
  };

 }

}


export const visionIntelligence =
new VisionIntelligence();
