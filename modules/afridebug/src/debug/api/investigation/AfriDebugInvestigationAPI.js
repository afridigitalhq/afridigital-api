import Orchestrator from "../../orchestrator/AfriDebugOrchestrator.js";
import State from "../../state/AfriDebugInvestigationStateManager.js";

const AfriDebugInvestigationAPI = {

  create(input = {}){

    return Orchestrator.run(input);

  },

  get(id){

    const investigation = State.get(id);

    return investigation
      ? { success:true, investigation }
      : { success:false, reason:"INVESTIGATION_NOT_FOUND" };

  },

  status(id){

    const investigation = State.get(id);

    return {
      success:!!investigation,
      status:investigation?.status || "UNKNOWN"
    };

  }

};

export default AfriDebugInvestigationAPI;
