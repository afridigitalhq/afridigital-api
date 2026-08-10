import CoreApprovalContract from "../../../../core/approval/CoreApprovalContract.js";

const AfriDebugRepairExecutionController = {

  execute(handoff = {}){

    const approved = CoreApprovalContract.canExecute(handoff.approvalContext || {});

    const ready =
      handoff.executionAllowed === true;

    return {

      executionId:
        "EXECUTION-" + Date.now(),

      handoffId:
        handoff.handoffId || null,

      planId:
        handoff.planId || null,

      approvalContext:
        handoff.approvalContext || null,

      status:
        approved && ready
          ? "EXECUTION_STARTED"
          : "BLOCKED",

      executionAllowed:
        approved && ready,

      verificationRequired:true,

      createdAt:
        Date.now()

    };

  },

  health(){

    return {
      service:"AfriDebugRepairExecutionController",
      status:"healthy"
    };

  }

};

export default AfriDebugRepairExecutionController;
