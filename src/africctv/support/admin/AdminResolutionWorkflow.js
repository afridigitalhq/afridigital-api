const actions=[];

export class AdminResolutionWorkflow{

 resolve(issue){

  actions.push({
   ...issue,
   status:"RESOLVED_BY_ADMIN"
  });

 }

 list(){

  return actions;

 }

}

export const adminResolutionWorkflow =
new AdminResolutionWorkflow();
