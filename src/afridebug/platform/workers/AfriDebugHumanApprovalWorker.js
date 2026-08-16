import Queue from "../approval/AfriDebugRepairApprovalQueue.js";
import Ledger from "../audit/AfriDebugImmutableAuditLedger.js";


const AfriDebugHumanApprovalWorker = {


  review(input={}){


    const decision =
      input.decision || "approve";


    let result;


    if(decision === "approve"){

      result =
        Queue.approve(
          input.approvalId,
          input.reviewer || "human"
        );

    }
    else if(decision === "reject"){

      result =
        Queue.reject(
          input.approvalId,
          input.reviewer || "human"
        );

    }


    Ledger.record({

      type:
        decision === "approve"
        ? "HUMAN_APPROVAL_GRANTED"
        : "HUMAN_APPROVAL_REJECTED",

      approvalId:
        input.approvalId,

      reviewer:
        input.reviewer || "human",

      actor:
        "AfriDebugHumanApprovalWorker"

    });


    return result;

  },


  health(){

    return {

      service:
        "AfriDebugHumanApprovalWorker",

      responsibility:
        "human-review",

      status:
        "healthy"

    };

  }

};


export default AfriDebugHumanApprovalWorker;
