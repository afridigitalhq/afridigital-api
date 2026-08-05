const CoreWorkspaceEngine={
 create(owner,context={}){
  return {
   id:"WS-"+Date.now(),
   owner,
   context,
   status:"ACTIVE",
   createdAt:new Date().toISOString()
  };
 }
};

export default CoreWorkspaceEngine;
