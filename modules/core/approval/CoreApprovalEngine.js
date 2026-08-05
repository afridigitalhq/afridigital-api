const CoreApprovalEngine={
 approve(request={}){
  return {
   id:"APR-"+Date.now(),
   request,
   status:"PENDING",
   createdAt:new Date().toISOString()
  };
 }
};

export default CoreApprovalEngine;
