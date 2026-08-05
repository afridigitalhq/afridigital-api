const CoreCaseManager={
 update(caseItem,changes={}){
  return {...caseItem,...changes,updatedAt:new Date().toISOString()};
 },
 close(caseItem){
  return {...caseItem,status:"CLOSED",closedAt:new Date().toISOString()};
 }
};

export default CoreCaseManager;
