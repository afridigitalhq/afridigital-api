import { afriAIIntelligenceOrchestrator } from "../../orchestrator/AfriAIIntelligenceOrchestrator.js";
import { adaptiveLearningOrchestrator } from "../learning/orchestrator/AdaptiveLearningOrchestrator.js";
import { predictiveCameraAI } from "../../predictive/PredictiveCameraAI.js";
import { afriAIOperationsAnalyst } from "../../operations/AfriAIOperationsAnalyst.js";
import { ecosystemIntelligenceOrchestrator } from "../../../ecosystem/orchestrator/EcosystemIntelligenceOrchestrator.js";
import { operationsExecutionOrchestrator } from "../../../operations/orchestrator/OperationsExecutionOrchestrator.js";

class CognitiveDecisionOrchestrator {

 decide(cognitiveEvent){

  return {

   intelligence:
    afriAIIntelligenceOrchestrator.coordinate
     ? afriAIIntelligenceOrchestrator.coordinate(cognitiveEvent)
     : null,

   learning:
    adaptiveLearningOrchestrator.coordinate
     ? adaptiveLearningOrchestrator.coordinate(cognitiveEvent)
     : null,

   prediction:
    predictiveCameraAI.predict
     ? predictiveCameraAI.predict(cognitiveEvent)
     : null,

   analysis:
    afriAIOperationsAnalyst.analyze
     ? afriAIOperationsAnalyst.analyze(cognitiveEvent)
     : null,

   ecosystem:
    ecosystemIntelligenceOrchestrator.coordinate
     ? ecosystemIntelligenceOrchestrator.coordinate(cognitiveEvent)
     : null,

   execution:
    operationsExecutionOrchestrator.execute
     ? operationsExecutionOrchestrator.execute(cognitiveEvent)
     : null,

   decidedAt: Date.now()

  };

 }

}

export const cognitiveDecisionOrchestrator =
 new CognitiveDecisionOrchestrator();
