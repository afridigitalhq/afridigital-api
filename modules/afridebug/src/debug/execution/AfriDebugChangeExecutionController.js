import PatchRuntime from "../patch/AfriDebugPatchRuntime.js";
import VerificationRuntime from "../verification/AfriDebugVerificationRuntime.js";
import RollbackRuntime from "../production/rollback/AfriDebugRollbackRuntime.js";

const executions=[];

const AfriDebugChangeExecutionController = {

  execute(input={}){

    const patch = PatchRuntime.propose({
      issue: input.issue,
      files: input.files || [],
      action: input.action || "repair"
    });


    const approval = PatchRuntime.approve(patch.id);


    if(!approval.success){

      return {
        status:"failed",
        reason:"PATCH_APPROVAL_FAILED"
      };

    }


    const verification =
      VerificationRuntime.verify({
        patchId:patch.id,
        tests:input.tests || []
      });


    let rollback=null;


    if(verification.status !== "VERIFIED"){

      rollback = RollbackRuntime.rollback({
        incidentId:input.incidentId,
        patchId:patch.id,
        version:input.version,
        reason:"verification_failed",
        approvalStatus:"pending"
      });

    }


    const execution={

      executionId:`EXEC-${Date.now()}`,

      incidentId:input.incidentId || null,

      patch,

      verification,

      rollback,

      status:
        rollback
        ? "rollback_required"
        : "completed",

      completedAt:Date.now()

    };


    executions.push(execution);

    return execution;

  },


  list(){

    return executions;

  },


  health(){

    return {
      service:"AfriDebugChangeExecutionController",
      status:"healthy"
    };

  }

};


export default AfriDebugChangeExecutionController;
