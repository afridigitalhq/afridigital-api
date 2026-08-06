import Planner from "../../planning/AfriDebugRepairPlanningEngine.js";
import Controller from "../../execution/AfriDebugChangeExecutionController.js";

const AfriDebugRepairExecutionBridge = {

  execute(input={}){

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


    return {

      plan,

      execution,

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
