const CorePipelineEngine={
 run(stages=[],context={}){
  return {
   id:"PIPE-"+Date.now(),
   stages,
   context,
   currentStage:stages[0]||null,
   totalStages:stages.length,
   status:"PIPELINE_RUNNING",
   startedAt:new Date().toISOString()
  };
 }
};

export default CorePipelineEngine;
