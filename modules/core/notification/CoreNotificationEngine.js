const CoreNotificationEngine={
 notify(channel,payload={}){
  return {
   id:"NOT-"+Date.now(),
   channel,
   payload,
   status:"QUEUED",
   createdAt:new Date().toISOString()
  };
 }
};

export default CoreNotificationEngine;
