export class RecoveryEngine {

 backup(data){

  return {
   created:true,
   timestamp:Date.now(),
   size:Object.keys(data).length
  };

 }

}


export const recoveryEngine =
new RecoveryEngine();
