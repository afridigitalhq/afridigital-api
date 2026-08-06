import Planner from "../planning/AfriDebugRepairPlanningEngine.js";
import Queue from "../approval/AfriDebugRepairApprovalQueue.js";
import Gate from "../governance/AfriDebugExecutionGate.js";

const AfriDebugOrchestrator = {

  prepare(input={}){

    const plan =
      Planner.plan(input);


    const approval =
      Queue.submit({

        planId:plan.planId,

        incidentId:
          input.incidentId,

        action:
          plan.action

      });


    return {

      plan,

      approval,

      status:"awaiting_approval"

    };

  },


  execute(input={}){

    return Gate.execute(input);

  },


  health(){

    return {

      service:"AfriDebugOrchestrator",

      status:"healthy"

    };

  }

};


export default AfriDebugOrchestrator;
