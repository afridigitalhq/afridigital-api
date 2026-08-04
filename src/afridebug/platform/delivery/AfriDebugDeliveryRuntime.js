const deliveries = [];

const AfriDebugDeliveryRuntime = {

  create(input = {}) {

    const delivery = {
      id:`DELIVERY-${Date.now()}`,
      caseId:input.caseId || null,
      clientId:input.clientId || null,
      report:{
        generated:true,
        summary:input.summary || "Debug investigation completed",
        evidence:input.evidence || []
      },
      patch:{
        included:!!input.patchId,
        patchId:input.patchId || null
      },
      verification:{
        status:input.verificationStatus || "PENDING"
      },
      status:"WAITING_APPROVAL",
      createdAt:Date.now()
    };

    deliveries.push(delivery);

    return delivery;
  },


  approve(id) {

    const delivery = deliveries.find(x=>x.id===id);

    if(!delivery){
      return {
        success:false,
        reason:"DELIVERY_NOT_FOUND"
      };
    }

    delivery.status="APPROVED";

    return {
      success:true,
      delivery
    };
  },


  list(){
    return deliveries;
  },


  stats(){
    return {
      deliveries:deliveries.length
    };
  }

};

export default AfriDebugDeliveryRuntime;
