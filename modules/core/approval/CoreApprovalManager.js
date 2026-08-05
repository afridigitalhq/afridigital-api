const CoreApprovalManager={
 approve(approval,user){
  approval.status="APPROVED";
  approval.approvedBy=user;
  approval.approvedAt=new Date().toISOString();
  return approval;
 }
};

export default CoreApprovalManager;
