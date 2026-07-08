const logs=[];


export class AuditTrail {

 record(event){

  const entry={
   id:`audit-${Date.now()}`,
   timestamp:Date.now(),
   ...event
  };

  logs.push(entry);

  return entry;
 }


 history(){
  return logs;
 }

}


export const auditTrail =
new AuditTrail();
