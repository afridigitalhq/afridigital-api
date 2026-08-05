const AfriDebugSessionManager={
 create(input={}){
  return {
   investigationId:"INV-"+Date.now(),
   workspace:input.workspace||null,
   client:input.client||null,
   repository:input.repository||null,
   status:"SESSION_CREATED",
   stage:"REPOSITORY_INTAKE",
   progress:0,
   createdAt:new Date().toISOString()
  };
 },
 update(session,stage,progress=0){
  return {...session,stage,progress,status:"SESSION_RUNNING",updatedAt:new Date().toISOString()};
 },
 complete(session){
  return {...session,status:"SESSION_COMPLETED",progress:100,completedAt:new Date().toISOString()};
 }
};

export default AfriDebugSessionManager;
