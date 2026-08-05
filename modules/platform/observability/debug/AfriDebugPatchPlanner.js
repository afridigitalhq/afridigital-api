const AfriDebugPatchPlanner = {

  create(diagnosis,context={}){

    return {
      patchPlan:true,
      patchId:`patch-${Date.now()}`,
      createdAt:new Date().toISOString(),

      issue:{
        type:diagnosis.type,
        severity:diagnosis.severity,
        message:diagnosis.message
      },

      target:{
        file:context.file || "unknown",
        component:context.component || "unknown"
      },

      proposedChange:{
        action:"MODIFY",
        reason:diagnosis.recommendation
      },

      status:"WAITING_HUMAN_APPROVAL",

      authorization:{
        required:true,
        approved:false
      }

    };

  }

};

export default AfriDebugPatchPlanner;
