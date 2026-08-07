export class AfriApprovalController {

  approve(delivery){

    if(
      !delivery.approval ||
      delivery.approval.status !== "PENDING_HUMAN_REVIEW"
    ){
      return {
        component:"AfriNuc Approval Controller",
        status:"REJECTED",
        reason:"Invalid approval state"
      };
    }

    return {
      component:"AfriNuc Approval Controller",
      status:"APPROVED",
      previousStatus:
        delivery.approval.status,
      currentStatus:
        "READY_FOR_CLIENT_DELIVERY",
      approvedBy:"HUMAN_REVIEW",
      approvedAt:new Date().toISOString()
    };
  }
}
