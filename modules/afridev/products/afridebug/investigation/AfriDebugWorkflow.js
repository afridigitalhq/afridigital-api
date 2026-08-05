import AfriDebugLifecycleEngine from "../orchestration/AfriDebugLifecycleEngine.js";

const AfriDebugWorkflow={
  name:"AfriDebug Investigation Lifecycle",
  version:"2.0",
  stages:AfriDebugLifecycleEngine.stages,

  describe(){
    return {
      name:this.name,
      version:this.version,
      totalStages:this.stages.length,
      stages:this.stages
    };
  }
};

export default AfriDebugWorkflow;
