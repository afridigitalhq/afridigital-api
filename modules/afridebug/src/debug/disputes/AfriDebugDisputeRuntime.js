const disputes = [];

const AfriDebugDisputeRuntime = {

  create(input = {}) {

    const dispute = {
      id:`DISPUTE-${Date.now()}`,
      caseId:input.caseId || null,
      deliveryId:input.deliveryId || null,

      parties:{
        requester:input.requester || null,
        respondent:input.respondent || null
      },

      type:input.type || "TECHNICAL",

      reason:input.reason || null,

      evidence:{
        linked:false,
        items:[]
      },

      status:"OPEN",

      createdAt:Date.now()
    };

    disputes.push(dispute);

    return dispute;
  },


  attachEvidence(id, evidence = []) {

    const dispute = disputes.find(x=>x.id===id);

    if(!dispute){
      return {
        success:false,
        reason:"DISPUTE_NOT_FOUND"
      };
    }

    dispute.evidence.linked=true;
    dispute.evidence.items.push(...evidence);

    return {
      success:true,
      dispute
    };
  },


  list(){
    return disputes;
  },


  stats(){
    return {
      disputes:disputes.length,
      open:disputes.filter(x=>x.status==="OPEN").length
    };
  }

};

export default AfriDebugDisputeRuntime;
