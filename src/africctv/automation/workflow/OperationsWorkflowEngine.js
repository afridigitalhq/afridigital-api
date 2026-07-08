export class OperationsWorkflowEngine {

 execute(event){

  return {
   workflow:event.type,
   status:"COMPLETED"
  };

 }

}


export const operationsWorkflowEngine =
new OperationsWorkflowEngine();
