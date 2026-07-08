export class RecoveryCoordinator{

 status(){

  return {
   backup:"READY",
   recoveryPlan:"DEFINED"
  };

 }

}


export const recoveryCoordinator =
new RecoveryCoordinator();
