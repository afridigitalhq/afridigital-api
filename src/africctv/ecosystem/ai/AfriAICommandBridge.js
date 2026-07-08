export class AfriAICommandBridge{

 analyze(event){

  return {
   module:"africctv",
   aiStatus:"READY",
   event
  };

 }

}


export const afriAICommandBridge =
new AfriAICommandBridge();
