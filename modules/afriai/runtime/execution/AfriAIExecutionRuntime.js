import AfriAIPreviewRuntime from "../../execution/preview/AfriAIPreviewRuntime.js";
import AfriAIApprovalRuntime from "../../execution/approval/AfriAIApprovalRuntime.js";

const AfriAIExecutionRuntime={

  execute(request={}){

    const preview =
      AfriAIPreviewRuntime.create(
        request.action || request,
        request.context || {}
      );

    const approval =
      AfriAIApprovalRuntime.approve(
        preview
      );

    return{
      preview,
      approval,
      status:"EXECUTION_READY"
    };

  }

};

export default AfriAIExecutionRuntime;
