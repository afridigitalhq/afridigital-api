import Queue from "../approval/AfriDebugRepairApprovalQueue.js";
import Bridge from "../integration/execution/AfriDebugRepairExecutionBridge.js";
import Ledger from "../audit/AfriDebugImmutableAuditLedger.js";
import ArtifactStorage from "../storage/AfriDebugArtifactStorage.js";


const AfriDebugExecutionGate = {


  execute(input={}){


    const approval =
      Queue.list()
      .find(
        item =>
        item.approvalId === input.approvalId
      );


    if(
      !approval ||
      approval.status?.toUpperCase() !== "APPROVED"
    ){

      return {

        status:"blocked",

        reason:"APPROVAL_REQUIRED"

      };

    }


    const execution =
      Bridge.execute(input);


    const artifact={

      id:`EXECUTION-${Date.now()}`,

      approvalId:
        input.approvalId,

      status:"EXECUTED",

      execution,

      createdAt:Date.now()

    };


    ArtifactStorage.save(
      "executions",
      artifact.id,
      artifact
    );


    Ledger.record({

      type:"EXECUTION_COMPLETED",

      executionId:
        artifact.id,

      approvalId:
        input.approvalId,

      actor:"AfriDebugExecutionGate"

    });


    return {

      status:"executed",

      approval,

      execution,

      artifact

    };

  },


  health(){

    return {

      service:"AfriDebugExecutionGate",

      auditBound:true,

      persistent:true,

      status:"healthy"

    };

  }

};


export default AfriDebugExecutionGate;
