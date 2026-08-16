import Orchestrator from "../../../../src/afridebug/platform/orchestration/AfriDebugInvestigationOrchestrator.js";
import State from "../state/AfriDebugInvestigationStateManager.js";

const AfriDebugInvestigationAPI = {

  create(input = {}){

    return Orchestrator.run(input);

  },

  get(investigationId){

    const state = State.get(investigationId);

    if(!state){

      return {
        success:false,
        reason:"INVESTIGATION_NOT_FOUND"
      };

    }

    return {
      success:true,
      investigation:state
    };

  },

  status(investigationId){

    const state = State.get(investigationId);

    return {
      success:!!state,
      investigationId,
      status:state?.status || "UNKNOWN"
    };

  },

  health(){

    return {
      service:"AfriDebugInvestigationAPI",
      status:"healthy",
      version:"AFDS026.1"
    };

  }

};

export default AfriDebugInvestigationAPI;
