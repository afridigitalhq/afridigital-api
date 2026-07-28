import AfriAIExecutionStatus from "../status/AfriAIExecutionStatus.js";

const AfriAIPreviewRuntime = {

 create(request={}){

   const executionId =
     "exec_" + Date.now();

   return {

     executionId,

     type:request.type,

     status:
       AfriAIExecutionStatus.AWAITING_APPROVAL,

     preview:{
       title:
         request.title || "AfriAI Action Preview",

       details:
         request.payload || {}
     },

     requiresApproval:true,

     createdAt:
       new Date().toISOString(),

     expiresAt:
       new Date(Date.now()+30*60000).toISOString()

   };

 }

};

export default AfriAIPreviewRuntime;
