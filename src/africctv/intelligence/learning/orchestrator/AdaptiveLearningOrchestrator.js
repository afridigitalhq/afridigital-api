import { cameraBehaviorLearning } from "../CameraBehaviorLearning.js";
import { predictiveCameraAI } from "../../predictive/PredictiveCameraAI.js";
import { cameraDataAnalyticsEngine } from "../../../analytics/core/CameraDataAnalyticsEngine.js";
import { visionIntelligence } from "../../../global/ai/VisionIntelligence.js";
import { afriAIOperationsAnalyst } from "../../operations/AfriAIOperationsAnalyst.js";
import { afriAIIntelligenceOrchestrator } from "../../orchestrator/AfriAIIntelligenceOrchestrator.js";

class AdaptiveLearningOrchestrator {

 coordinate(learningEvent){

  return {

   behavior:
    cameraBehaviorLearning.learn
     ? cameraBehaviorLearning.learn(learningEvent)
     : null,

   prediction:
    predictiveCameraAI.predict
     ? predictiveCameraAI.predict(learningEvent)
     : null,

   analytics:
    cameraDataAnalyticsEngine.analyze
     ? cameraDataAnalyticsEngine.analyze(learningEvent)
     : null,

   vision:
    visionIntelligence.process
     ? visionIntelligence.process(learningEvent)
     : null,

   operations:
    afriAIOperationsAnalyst.analyze
     ? afriAIOperationsAnalyst.analyze(learningEvent)
     : null,

   intelligence:
    afriAIIntelligenceOrchestrator.coordinate
     ? afriAIIntelligenceOrchestrator.coordinate(learningEvent)
     : null,

   coordinatedAt: Date.now()

  };

 }

}

export const adaptiveLearningOrchestrator =
 new AdaptiveLearningOrchestrator();
