import AfriAIExecutionStatus from "../status/AfriAIExecutionStatus.js";

const approvals = new Map();

const AfriAIApprovalRuntime = {

 approve(execution){

   const approval = {

     ...execution,

     status:
       AfriAIExecutionStatus.APPROVED,

     approvedAt:
       new Date().toISOString()

   };

   approvals.set(
     execution.executionId,
     approval
   );

   return approval;

 },


 get(executionId){

   return approvals.get(executionId) || null;

 }

};

export default AfriAIApprovalRuntime;
