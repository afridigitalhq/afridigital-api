export class FaultDetectionEngine{

 inspect(component){

  return {
   component,
   issue:false,
   diagnostics:"CLEAR"
  };

 }

}


export const faultDetectionEngine =
new FaultDetectionEngine();
