import { afriAIContextLayer } from "../ai-context/AfriAIContextLayer.js";
import { afriAICommandBridge } from "../ai/AfriAICommandBridge.js";
import { securitySignalBus } from "../bus/SecuritySignalBus.js";
import { afriDigitalEventBridge } from "../events/AfriDigitalEventBridge.js";
import { afriDigitalEventMeshConnector } from "../mesh/AfriDigitalEventMeshConnector.js";
import { ecosystemBridge } from "../../global/ecosystem/EcosystemBridge.js";
import { afriControlPlaneConnector } from "../control/AfriControlPlaneConnector.js";
import { afriAIIntelligenceOrchestrator } from "../../intelligence/orchestrator/AfriAIIntelligenceOrchestrator.js";

class EcosystemIntelligenceOrchestrator {

 coordinate(ecosystemEvent){

  return {

   context:
    afriAIContextLayer.process
     ? afriAIContextLayer.process(ecosystemEvent)
     : null,

   command:
    afriAICommandBridge.execute
     ? afriAICommandBridge.execute(ecosystemEvent)
     : null,

   security:
    securitySignalBus.publish
     ? securitySignalBus.publish(ecosystemEvent)
     : null,

   events:
    afriDigitalEventBridge.emit
     ? afriDigitalEventBridge.emit(ecosystemEvent)
     : null,

   mesh:
    afriDigitalEventMeshConnector.connect
     ? afriDigitalEventMeshConnector.connect(ecosystemEvent)
     : null,

   ecosystem:
    ecosystemBridge.sync
     ? ecosystemBridge.sync(ecosystemEvent)
     : null,

   control:
    afriControlPlaneConnector.connect
     ? afriControlPlaneConnector.connect(ecosystemEvent)
     : null,

   intelligence:
    afriAIIntelligenceOrchestrator.coordinate
     ? afriAIIntelligenceOrchestrator.coordinate(ecosystemEvent)
     : null,

   coordinatedAt: Date.now()

  };

 }

}

export const ecosystemIntelligenceOrchestrator =
 new EcosystemIntelligenceOrchestrator();
