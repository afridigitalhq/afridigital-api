const logs=[];

export class SecurityAuditManager {

 record(event){

  logs.push({
   ...event,
   timestamp:Date.now()
  });

 }


 history(){

  return logs;

 }

}


export const securityAuditManager =
new SecurityAuditManager();
