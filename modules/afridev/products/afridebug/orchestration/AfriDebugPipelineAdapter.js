import CorePipelineEngine from "../../../../core/pipeline/CorePipelineEngine.js";
import CorePipelineRegistry from "../../../../core/pipeline/CorePipelineRegistry.js";

const SERVICE="AfriDebug";

const AfriDebugPipelineAdapter={
 run(stages=[],context={}){
  const pipeline=CorePipelineEngine.run(stages,{
   service:SERVICE,
   ...context
  });

  const registration=CorePipelineRegistry.register(SERVICE,pipeline);

  return {
   ...pipeline,
   registration
  };
 }
};

export default AfriDebugPipelineAdapter;
