const records=[];

export class AuditEventIntelligence{

 log(entry){

  records.push({
   ...entry,
   timestamp:Date.now()
  });

 }

 history(){

  return records;

 }

}


export const auditEventIntelligence =
new AuditEventIntelligence();
