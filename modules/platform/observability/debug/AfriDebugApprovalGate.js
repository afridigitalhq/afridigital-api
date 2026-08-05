const AfriDebugApprovalGate = {

  approve(patchPlan,reviewer="human"){

    if(!patchPlan?.authorization?.required){
      return {
        approved:false,
        reason:"Approval requirement missing"
      };
    }

    return {
      approval:true,
      patchId:patchPlan.patchId,
      approved:true,
      approvedBy:reviewer,
      approvedAt:new Date().toISOString(),
      status:"AUTHORIZED",
      rollbackRequired:true
    };

  },

  reject(patchPlan,reason="Rejected by human"){

    return {
      approval:true,
      patchId:patchPlan.patchId,
      approved:false,
      status:"REJECTED",
      reason,
      rejectedAt:new Date().toISOString()
    };

  }

};

export default AfriDebugApprovalGate;
