const actions=[];

export class SecurityResponseCommand{

 execute(command){

  actions.push({
   ...command,
   actor:"ADMIN"
  });

 }

 history(){

  return actions;

 }

}

export const securityResponseCommand =
new SecurityResponseCommand();
