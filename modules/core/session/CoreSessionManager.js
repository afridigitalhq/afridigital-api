const CoreSessionManager={
 create(type,payload={}){
  return {
   sessionId:"SES-"+Date.now(),
   type,
   payload,
   status:"SESSION_CREATED",
   createdAt:new Date().toISOString()
  };
 },
 update(session,changes={}){
  return {...session,...changes,updatedAt:new Date().toISOString()};
 },
 complete(session){
  return {...session,status:"SESSION_COMPLETED",completedAt:new Date().toISOString()};
 }
};

export default CoreSessionManager;
