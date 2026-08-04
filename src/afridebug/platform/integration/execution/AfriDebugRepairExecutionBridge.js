import Orchestrator from "../../orchestration/AfriDebugExecutionOrchestrator.js";

const AfriDebugRepairExecutionBridge = {

  prepare(input={}){

    return Orchestrator.prepare({

      incidentId:
        input.incidentId,

      issue:
        input.issue,

      files:
        input.files || [],

      risk:
        input.risk

    });

  },


  execute(input={}){

    return Orchestrator.execute(input);

  },


  health(){

    return {

      service:
        "AfriDebugRepairExecutionBridge",

      status:
        "healthy",

      responsibility:
        "governed-repair-execution"

    };

  }

};

export default AfriDebugRepairExecutionBridge;
