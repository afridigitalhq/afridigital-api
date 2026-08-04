import PatchRuntime from "../patch/AfriDebugPatchRuntime.js";

const AfriDebugPatchPlanningWorker = {

  execute(input = {}) {

    const patch =
      PatchRuntime.propose({

        issue:
          input.issue || null,

        files:
          input.files || [],

        action:
          "repair"

      });


    return {

      id:patch.id,

      investigationId:
        input.investigationId || null,

      issue:
        patch.issue,

      action:
        patch.action,

      changes:[
        {
          type:"analysis",
          description:"Generated patch strategy"
        }
      ],

      status:"PATCH_PLAN_READY",

      createdAt:patch.createdAt

    };

  }

};

export default AfriDebugPatchPlanningWorker;
