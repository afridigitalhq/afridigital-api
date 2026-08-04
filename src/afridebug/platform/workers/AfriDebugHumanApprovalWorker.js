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

      const request =
        Queue.list()
        .find(
          item =>
          item.approvalId === input.approvalId
        );


      if(request){

        request.status="rejected";
        request.rejectedBy =
          input.reviewer || "human";
        request.rejectedAt =
          Date.now();

        result={
          success:true,
          request
        };

      }
      else{

        result={
          success:false,
          reason:"APPROVAL_NOT_FOUND"
        };

      }

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
