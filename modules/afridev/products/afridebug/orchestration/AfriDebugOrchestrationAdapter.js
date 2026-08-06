import CoreOrchestrationEngine from "../../../../core/orchestration/CoreOrchestrationEngine.js";
import CorePipelineEngine from "../../../../core/pipeline/CorePipelineEngine.js";
import CoreWorkflowEngine from "../../../../core/workflow/CoreWorkflowEngine.js";
import CoreOrchestrationStageManager from "../../../../core/orchestration/CoreOrchestrationStageManager.js";

const AfriDebugOrchestrationAdapter={
  workflow(name){return CoreWorkflowEngine.start(name);},
  orchestrate(stages,context={}){return CoreOrchestrationEngine.execute(stages,context);},
  pipeline(stages,context={}){return CorePipelineEngine.run(stages,context);},
  advance(orchestration,stage){return CoreOrchestrationStageManager.advance(orchestration,stage);}
};

export default AfriDebugOrchestrationAdapter;
