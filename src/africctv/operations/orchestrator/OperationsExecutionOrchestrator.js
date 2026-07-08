import { operationsWorkflowEngine } from "../../automation/workflow/OperationsWorkflowEngine.js";
import { incidentResponseEngine } from "../../automation/response/IncidentResponseEngine.js";
import { alertPriorityEngine } from "../../automation/alerts/AlertPriorityEngine.js";
import { cameraCommandQueue } from "../../control/commands/CameraCommandQueue.js";
import { adminResolutionWorkflow } from "../../support/admin/AdminResolutionWorkflow.js";
import { edgeEventProcessingPipeline } from "../../edge-intelligence/events/EdgeEventProcessingPipeline.js";

class OperationsExecutionOrchestrator {

 execute(operationEvent){

  return {

   workflow:
    operationsWorkflowEngine.process
     ? operationsWorkflowEngine.process(operationEvent)
     : null,

   incident:
    incidentResponseEngine.respond
     ? incidentResponseEngine.respond(operationEvent)
     : null,

   priority:
    alertPriorityEngine.evaluate
     ? alertPriorityEngine.evaluate(operationEvent)
     : null,

   command:
    cameraCommandQueue.enqueue
     ? cameraCommandQueue.enqueue(operationEvent)
     : null,

   resolution:
    adminResolutionWorkflow.resolve
     ? adminResolutionWorkflow.resolve(operationEvent)
     : null,

   edge:
    edgeEventProcessingPipeline.process
     ? edgeEventProcessingPipeline.process(operationEvent)
     : null,

   coordinatedAt: Date.now()

  };

 }

}

export const operationsExecutionOrchestrator =
 new OperationsExecutionOrchestrator();
