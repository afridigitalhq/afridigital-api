const queue = [];

const AfriDebugRepairApprovalQueue = {

  submit(input={}){

    const request = {

      approvalId:
        `APPROVAL-${Date.now()}`,

      planId:
        input.planId || null,

      incidentId:
        input.incidentId || null,

      action:
        input.action || null,

      status:
        "pending",

      submittedAt:
        Date.now()

    };


    queue.push(request);

    return request;

  },


  approve(id, user="AfriDebugAdmin"){

    const request =
      queue.find(
        item=>item.approvalId===id
      );


    if(!request){

      return {
        success:false,
        reason:"APPROVAL_NOT_FOUND"
      };

    }


    request.status="approved";
    request.approvedBy=user;
    request.approvedAt=Date.now();


    return {

      success:true,
      request

    };

  },


  list(){

    return queue;

  },


  health(){

    return {

      service:"AfriDebugRepairApprovalQueue",

      status:"healthy"

    };

  }

};


export default AfriDebugRepairApprovalQueue;
