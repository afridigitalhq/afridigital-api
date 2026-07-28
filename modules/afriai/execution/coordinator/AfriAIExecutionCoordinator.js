import AfriAIPreviewRuntime from "../preview/AfriAIPreviewRuntime.js";
import AfriAIApprovalRuntime from "../approval/AfriAIApprovalRuntime.js";

const AfriAIExecutionCoordinator = {

 preview(request){

   return AfriAIPreviewRuntime.create(
     request
   );

 },


 approve(execution){

   return AfriAIApprovalRuntime.approve(
     execution
   );

 }

};

export default AfriAIExecutionCoordinator;
