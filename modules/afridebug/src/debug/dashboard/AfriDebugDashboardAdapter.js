import State from "../state/AfriDebugInvestigationStateManager.js";
import Events from "../events/AfriDebugEventStream.js";


const AfriDebugDashboardAdapter = {

  getInvestigation(id){

    const state = State.get(id);

    if(!state){
      return {
        success:false,
        reason:"INVESTIGATION_NOT_FOUND"
      };
    }


    const events =
      Events.list(id);


    const latest =
      events[events.length - 1];


    const progressMap = {

      CREATED:0,

      INTAKE_RUNNING:15,

      ANALYZING:35,

      PATCH_READY:60,

      VERIFYING:75,

      EVIDENCE_READY:90,

      DELIVERED:100
    };


    return {

      success:true,

      investigationId:id,

      status:state.status,

      progress:
        progressMap[state.status] || 0,

      currentStage:
        latest?.type || null,

      timeline:
        events,

      evidence:{
        available:
          state.status==="EVIDENCE_READY" ||
          state.status==="DELIVERED"
      },

      delivery:{
        ready:
          state.status==="DELIVERED"
      }

    };

  },


  stats(){

    return {
      service:"AfriDebugDashboardAdapter",
      status:"healthy"
    };

  }

};


export default AfriDebugDashboardAdapter;
