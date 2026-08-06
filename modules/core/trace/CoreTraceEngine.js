const CoreTraceEngine={
 traces:{},

 start(service="unknown"){
  const id=`${service.toLowerCase()}-${Date.now()}`;

  this.traces[id]={
   id,
   service,
   events:[],
   startedAt:new Date().toISOString()
  };

  return id;
 },

 event(id,stage,data={}){
  const entry={
   stage,
   data,
   timestamp:new Date().toISOString()
  };

  if(this.traces[id]){
   this.traces[id].events.push(entry);
  }

  return entry;
 },

 finish(id,status="COMPLETED"){
  if(!this.traces[id]) return null;

  this.traces[id].status=status;
  this.traces[id].finishedAt=new Date().toISOString();

  return this.traces[id];
 },

 get(id){
  return this.traces[id] || null;
 },

 inspect(target={},meta={}){
  return {
   target,
   meta,
   timestamp:new Date().toISOString(),
   status:"INSPECTED"
  };
 },

 error(error,context={}){
  return {
   error:error?.message || error,
   context,
   timestamp:new Date().toISOString(),
   status:"ERROR_CAPTURED"
  };
 },

 health(component,status){
  return {
   component,
   status,
   checkedAt:new Date().toISOString()
  };
 }
};

export default CoreTraceEngine;
