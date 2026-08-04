const AfriAIExecutionTrace = {

 start(){
  return {
   startedAt:Date.now(),
   providersChecked:[],
   selectedProvider:null,
   status:"RUNNING"
  };
 },

 finish(trace,data={}){
  return {
   ...trace,
   ...data,
   durationMs:Date.now()-trace.startedAt,
   status:"COMPLETED"
  };
 }

};

export default AfriAIExecutionTrace;
