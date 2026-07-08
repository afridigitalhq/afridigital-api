const signals=[];

export class SecuritySignalBus{

 emit(signal){

  signals.push(signal);

 }


 get(){

  return signals;

 }

}


export const securitySignalBus =
new SecuritySignalBus();
