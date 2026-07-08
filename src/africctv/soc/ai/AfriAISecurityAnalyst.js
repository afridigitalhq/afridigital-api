export class AfriAISecurityAnalyst{

 review(event){

  return {
   event:event.type,
   analysis:"PATTERN_REVIEW_AVAILABLE",
   action:"ADMIN_REVIEW_REQUIRED"
  };

 }

}

export const afriAISecurityAnalyst =
new AfriAISecurityAnalyst();
