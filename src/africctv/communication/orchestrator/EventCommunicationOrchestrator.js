import { afriCCTVEventPipeline } from "../../events/AfriCCTVEventPipeline.js";
import { communicationGateway } from "../gateway/CommunicationGateway.js";
import { alertDistributionEngine } from "../alerts/AlertDistributionEngine.js";
import { incidentResponseEngine } from "../../automation/response/IncidentResponseEngine.js";
import { adminNotificationCenter } from "../notifications/AdminNotificationCenter.js";
import { externalIntegrationGateway } from "../../ecosystem/integration/ExternalIntegrationGateway.js";


class EventCommunicationOrchestrator {


 dispatch(event){

  return {

   eventPipeline:
    afriCCTVEventPipeline.process
     ? afriCCTVEventPipeline.process(event)
     : null,


   communication:
    communicationGateway.send
     ? communicationGateway.send(event)
     : null,


   alerts:
    alertDistributionEngine.distribute
     ? alertDistributionEngine.distribute(event)
     : null,


   incident:
    incidentResponseEngine.handle
     ? incidentResponseEngine.handle(event)
     : null,


   notifications:
    adminNotificationCenter.notify
     ? adminNotificationCenter.notify(event)
     : null,


   integrations:
    externalIntegrationGateway.forward
     ? externalIntegrationGateway.forward(event)
     : null,


   coordinatedAt: Date.now()

  };

 }

}


export const eventCommunicationOrchestrator =
 new EventCommunicationOrchestrator();
