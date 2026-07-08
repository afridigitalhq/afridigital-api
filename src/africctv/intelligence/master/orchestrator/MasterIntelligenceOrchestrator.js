import { cognitiveDecisionOrchestrator } from "../../cognitive/orchestrator/CognitiveDecisionOrchestrator.js";
import { afriAIIntelligenceOrchestrator } from "../../orchestrator/AfriAIIntelligenceOrchestrator.js";
import { ecosystemIntelligenceOrchestrator } from "../../../ecosystem/orchestrator/EcosystemIntelligenceOrchestrator.js";
import { operationsExecutionOrchestrator } from "../../../operations/orchestrator/OperationsExecutionOrchestrator.js";
import { cameraCommandCenter } from "../../../control-plane/command-center/CameraCommandCenter.js";
import { governanceTrustOrchestrator } from "../../../governance/orchestrator/GovernanceTrustOrchestrator.js";

class MasterIntelligenceOrchestrator {

 coordinate(masterEvent){

  return {

   cognition:
    cognitiveDecisionOrchestrator.decide
     ? cognitiveDecisionOrchestrator.decide(masterEvent)
     : null,

   intelligence:
    afriAIIntelligenceOrchestrator.coordinate
     ? afriAIIntelligenceOrchestrator.coordinate(masterEvent)
     : null,

   ecosystem:
    ecosystemIntelligenceOrchestrator.coordinate
     ? ecosystemIntelligenceOrchestrator.coordinate(masterEvent)
     : null,

   operations:
    operationsExecutionOrchestrator.execute
     ? operationsExecutionOrchestrator.execute(masterEvent)
     : null,

   command:
    cameraCommandCenter.execute
     ? cameraCommandCenter.execute(masterEvent)
     : null,

   governance:
    governanceTrustOrchestrator.coordinate
     ? governanceTrustOrchestrator.coordinate(masterEvent)
     : null,

   coordinatedAt: Date.now()

  };

 }

}

export const masterIntelligenceOrchestrator =
 new MasterIntelligenceOrchestrator();
