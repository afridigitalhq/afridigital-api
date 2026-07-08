import { visionIntelligence } from "../../global/ai/VisionIntelligence.js";
import { predictiveCameraAI } from "../predictive/PredictiveCameraAI.js";
import { cameraBehaviorLearning } from "../learning/CameraBehaviorLearning.js";
import { afriAIOperationsAnalyst } from "../operations/AfriAIOperationsAnalyst.js";
import { alertEngine } from "../alerts/AlertEngine.js";
import { motionDetectionPipeline } from "../motion/MotionDetectionPipeline.js";


export class AfriAIIntelligenceOrchestrator {

 analyze(input){

  return {

   vision:
    visionIntelligence.analyze
     ? visionIntelligence.analyze(input)
     : null,

   prediction:
    predictiveCameraAI.predict
     ? predictiveCameraAI.predict(input)
     : null,

   learning:
    cameraBehaviorLearning.learn
     ? cameraBehaviorLearning.learn(input)
     : null,

   operations:
    afriAIOperationsAnalyst.analyze
     ? afriAIOperationsAnalyst.analyze(input)
     : null,

   alerts:
    alertEngine.evaluate
     ? alertEngine.evaluate(input)
     : null,

   motion:
    motionDetectionPipeline.process
     ? motionDetectionPipeline.process(input)
     : null,

   analyzedAt: Date.now()

  };

 }

}


export const afriAIIntelligenceOrchestrator =
 new AfriAIIntelligenceOrchestrator();
