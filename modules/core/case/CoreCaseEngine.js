const CoreCaseEngine={
 create(type,data={}){
  return {id:"CASE-"+Date.now(),type,data,status:"OPEN",createdAt:new Date().toISOString()};
 }
};

export default CoreCaseEngine;
