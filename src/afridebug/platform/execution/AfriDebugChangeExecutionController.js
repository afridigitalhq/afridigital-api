import VerificationRuntime from "../verification/AfriDebugVerificationRuntime.js";
import RollbackRuntime from "../production/rollback/AfriDebugRollbackRuntime.js";


const executions=[];


const AfriDebugChangeExecutionController = {


  execute(input={}){


    const patch =
      input.patch || null;


    if(!patch){

      return {

        status:"failed",

        reason:"PATCH_REQUIRED"

      };

    }


    const verification =
      VerificationRuntime.verify({

        patchId:
          patch.id,

        tests:
          input.tests || []

      });


    let rollback=null;


    if(verification.status !== "VERIFIED"){


      rollback =
        RollbackRuntime.rollback({

          incidentId:
            input.incidentId,

          patchId:
            patch.id,

          version:
            input.version,

          reason:
            "verification_failed",

          approvalStatus:
            "approved"

        });

    }


    const execution={


      executionId:
        `EXEC-${Date.now()}`,


      incidentId:
        input.incidentId || null,


      patch,


      verification,


      rollback,


      status:
        rollback
        ? "rollback_required"
        : "completed",


      completedAt:
        Date.now()


    };


    executions.push(execution);


    return execution;

  },


  list(){

    return executions;

  },


  health(){

    return {

      service:
        "AfriDebugChangeExecutionController",

      responsibility:
        "change-execution",

      status:
        "healthy"

    };

  }


};


export default AfriDebugChangeExecutionController;
