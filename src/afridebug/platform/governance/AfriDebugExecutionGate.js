import Queue from "../approval/AfriDebugRepairApprovalQueue.js";
import Bridge from "../integration/execution/AfriDebugRepairExecutionBridge.js";
import Ledger from "../audit/AfriDebugImmutableAuditLedger.js";
import ArtifactStorage from "../storage/AfriDebugArtifactStorage.js";
import BlockExplanationContract from "../../../core/afridebug/contracts/BlockExplanationContract.js";


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

      return BlockExplanationContract.createBlockedResponse({
        reasonCode:"APPROVAL_REQUIRED",
        technicalReason:"Approved repair authorization was not found for the supplied approvalId.",
        userExplanation:"AfriFix execution is blocked because the required human repair approval is missing or not approved.",
        evidenceReference:input.approvalId
          ? `approvalId:${input.approvalId}`
          : "approvalId:missing",
        requiredAction:"Obtain valid human approval before repair execution.",
        blockingGate:"AFRIDEBUG_EXECUTION_GATE",
        afrifixAllowed:false
      });

    }


    const bridgeResult =
      Bridge.execute(input);

    const execution =
      bridgeResult?.execution || bridgeResult;


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
