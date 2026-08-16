import Queue from "../../../../../src/afridebug/platform/approval/AfriDebugRepairApprovalQueue.js";
import CoreApprovalContract from "../../../../../modules/core/approval/CoreApprovalContract.js";
import Delivery from "../../../../../src/afridebug/platform/workers/AfriDebugDeliveryPackageWorker.js";
import State from "../state/AfriDebugInvestigationStateManager.js";
import Events from "../events/AfriDebugEventStream.js";
import ResolutionRecorder from "../learning/AfriDebugResolutionRecorder.js";
import KnowledgeMemory from "../../../../src/afridebug/platform/knowledge/AfriDebugKnowledgeAdapter.js";

const AfriDebugApprovalResumeService = {

  resume(input = {}) {

    const approval =
      ApprovalGate.canDeliver(input.approvalId);


    if (!approval.allowed) {

      return {
        status:"BLOCKED",
        approval
      };

    }


    const delivery =
      Delivery.execute({
        investigationId:
          input.investigationId,

        clientId:
          input.clientId || null,

        reportId:
          input.reportId || null
      });


    State.update(
      input.investigationId,
      "DELIVERED"
    );


    Events.emit({
      investigationId:
        input.investigationId,

      type:"DELIVERY_READY",

      actor:"ApprovalResumeService",

      details:"Delivery released after human approval"
    });


    const resolution =
      ResolutionRecorder.record({
        investigationId:
          input.investigationId,

        error:
          input.error || null,

        diagnosis:
          input.diagnosis || null,

        patch:
          input.patch || null,

        deliveryId:
          delivery.id
      });


    const knowledge =
      KnowledgeMemory.remember({
        issue:
          input.error || "unknown",

        diagnosis:
          input.diagnosis || null,

        resolution:
          resolution.id,

        verified:true
      });


    return {

      status:"DELIVERY_READY",

      delivery,

      approval,

      resolution,

      knowledge

    };

  },


  health(){

    return {
      service:"AfriDebugApprovalResumeService",
      status:"healthy"
    };

  }

};


export default AfriDebugApprovalResumeService;
