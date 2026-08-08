import Planner from "../../planning/AfriDebugRepairPlanningEngine.js";
import Controller from "../../execution/AfriDebugChangeExecutionController.js";
import Approval from "../../approval/AfriDebugRepairApprovalQueue.js";
import History from "../../history/AfriDebugRepairHistoryLedger.js";
import Resolution from "../../learning/AfriDebugResolutionRecorder.js";

const AfriDebugRepairExecutionBridge = {

  execute(input={}){

    const approval =
      Approval.list().find(
        item => item.approvalId === input.approvalId
      );

    if(!approval || approval.status !== "approved"){
      return {
        bridgeStatus:"blocked",
        reason:"APPROVAL_REQUIRED"
      };
    }

    const plan =
      Planner.plan({
        issue:input.issue,
        files:input.files || [],
        risk:input.risk
      });


    const execution =
      Controller.execute({

        incidentId:
          input.incidentId,

        issue:
          plan.issue,

        files:
          plan.files,

        action:
          plan.action,

        tests:
          input.tests || [],

        version:
          input.version || "v1.0"

      });


    const history = History.record({
      incidentId: input.incidentId || execution.incidentId,
      approvalId: input.approvalId,
      issue: plan.issue,
      diagnosis: plan.diagnosis,
      planId: plan.planId,
      executionId: execution.executionId,
      verificationStatus: execution.verification?.status,
      rollbackStatus: execution.rollback ? "required" : "none",
      outcome: execution.status
    });

    const resolution = Resolution.record({
      investigationId: execution.incidentId,
      error: plan.issue,
      diagnosis: plan.diagnosis,
      patch: execution.patch,
      status: execution.status
    });

    return {

      plan,

      execution,

      history,

      resolution,

      bridgeStatus:"executed"

    };

  },


  health(){

    return {

      service:"AfriDebugRepairExecutionBridge",

      status:"healthy"

    };

  }

};


export default AfriDebugRepairExecutionBridge;
