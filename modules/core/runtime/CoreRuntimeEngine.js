const CoreRuntimeEngine={
 boot(service,context={}){
  return {
   service,
   context,
   status:"READY",
   startedAt:new Date().toISOString()
  };
 }
};

export default CoreRuntimeEngine;
