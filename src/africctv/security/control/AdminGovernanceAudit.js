const records=[];

export class AdminGovernanceAudit{

 record(action){

  records.push({
   ...action,
   time:Date.now()
  });

 }

 list(){

  return records;

 }

}


export const adminGovernanceAudit =
new AdminGovernanceAudit();
