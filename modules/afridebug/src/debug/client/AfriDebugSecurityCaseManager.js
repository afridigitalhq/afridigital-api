const cases=new Map();

const Manager={

open(data){

const securityCase={
caseId:"CASE-"+Date.now(),
incidentId:data.incidentId,
client:data.client,
platform:data.platform,
severity:data.severity,
status:"open",
createdAt:Date.now(),
createdAtISO:new Date().toISOString()
};

cases.set(securityCase.caseId,securityCase);
return securityCase;

},

update(caseId,status){

const securityCase=cases.get(caseId);
if(!securityCase) return null;

securityCase.status=status;
securityCase.updatedAt=Date.now();
securityCase.updatedAtISO=new Date().toISOString();

return securityCase;

},

get(caseId){
return cases.get(caseId);
},

list(){
return [...cases.values()];
},

stats(){

const all=[...cases.values()];

return{
total:all.length,
open:all.filter(c=>c.status==="open").length,
investigating:all.filter(c=>c.status==="investigating").length,
resolved:all.filter(c=>c.status==="resolved").length,
closed:all.filter(c=>c.status==="closed").length
};

},

health(){

return{
service:"AfriDebugSecurityCaseManager",
status:"healthy"
};

}

};

export default Manager;
