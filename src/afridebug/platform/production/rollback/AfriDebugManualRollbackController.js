import RollbackRuntime from "./AfriDebugRollbackRuntime.js";

const AfriDebugManualRollbackController = {

  request(input={}){

    return RollbackRuntime.rollback({

      incidentId: input.incidentId || null,
      patchId: input.patchId || null,
      version: input.version || null,
      reason: input.reason || "manual_request",
      triggeredBy: input.triggeredBy || "admin",
      approvalStatus:"pending"

    });

  },

  approve(id, approvedBy="admin") {
    return RollbackRuntime.approve(id, approvedBy);
  },

  health(){

    return {
      service:"AfriDebugManualRollbackController",
      status:"healthy"
    };

  }

};

export default AfriDebugManualRollbackController;
