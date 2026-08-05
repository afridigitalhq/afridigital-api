import AfriDebugLifecycleEngine from "./AfriDebugLifecycleEngine.js";

const AfriDebugPipelineManager={
  run(stage,context={}){
    const valid=AfriDebugLifecycleEngine.stages.includes(stage);

    if(!valid){
      return {
        stage,
        status:"INVALID_STAGE"
      };
    }

    return {
      stage,
      context,
      position:AfriDebugLifecycleEngine.stages.indexOf(stage)+1,
      totalStages:AfriDebugLifecycleEngine.stages.length,
      status:"STAGE_RUNNING",
      timestamp:new Date().toISOString()
    };
  }
};

export default AfriDebugPipelineManager;
