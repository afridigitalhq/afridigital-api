import AfriAIPreviewRuntime from "../preview/AfriAIPreviewRuntime.js";
import AfriAIApprovalRuntime from "../approval/AfriAIApprovalRuntime.js";
import AfriAIExecutionReceipt from "../receipts/AfriAIExecutionReceipt.js";
import AfriAIExecutionAudit from "../audit/AfriAIExecutionAudit.js";
import AfriAIExecutionStatus from "../status/AfriAIExecutionStatus.js";
import AfriAISkillRegistry from "../../skills/registry/AfriAISkillRegistry.js";
import AfriAICapabilityRegistry from "../../skills/registry/AfriAICapabilityRegistry.js";
import AfriAISkillPermissions from "../../skills/permissions/AfriAISkillPermissions.js";
import AfriAISkillExecutor from "../../skills/executor/AfriAISkillExecutor.js";

const AfriAIExecutionCoordinator = {

preview(request){
 return AfriAIPreviewRuntime.create(request);
},

approve(execution){
 return AfriAIApprovalRuntime.approve(execution);
},

async execute(request={}){

 const capability =
   AfriAICapabilityRegistry.resolve(
    request.intent || "conversation"
   );

 const skill =
   request.skill || capability.skill;

 const available =
   AfriAISkillRegistry.load();

 if(!available.includes(skill)){
  return {
   status:AfriAIExecutionStatus.FAILED,
   reason:"SKILL_NOT_AVAILABLE"
  };
 }

 const permission =
   AfriAISkillPermissions.check(skill);

 if(!permission.allowed){
  return {
   status:AfriAIExecutionStatus.CANCELLED,
   reason:"PERMISSION_DENIED"
  };
 }

 const result =
   await AfriAISkillExecutor.run(
    skill,
    request.data || {}
   );

 const receipt =
   AfriAIExecutionReceipt.create(result);

 const audit =
   AfriAIExecutionAudit.record({
    skill,
    status:AfriAIExecutionStatus.COMPLETED
   });

 return {
  status:AfriAIExecutionStatus.COMPLETED,
  skill,
  result,
  receipt,
  audit
 };

}

};

export default AfriAIExecutionCoordinator;
