export class AfriAIExecutiveSummary{

 generate(metrics){

  return {
   observation:"OPERATIONS_REVIEW_AVAILABLE",
   recommendation:"ADMIN_REVIEW_REQUIRED"
  };

 }

}

export const afriAIExecutiveSummary =
new AfriAIExecutiveSummary();
