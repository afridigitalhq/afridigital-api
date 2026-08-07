import { AfriWorkspaceExecutionContext } from "../workspace/AfriWorkspaceExecutionContext.js";

export class AfriWorkspaceOrchestrator {

  constructor(){
    this.context = new AfriWorkspaceExecutionContext();
    this.active=[];
  }

  execute(workspace,job){

    const context =
      this.context.create(
        workspace,
        job
      );

    if(context.status !== "CREATED"){
      return context;
    }

    this.active.push(context.context);

    return {
      component:"AfriNuc Workspace Orchestrator",
      status:"EXECUTION_CONTEXT_REGISTERED",
      context:context.context,
      activeWorkspaces:this.active.length,
      createdAt:new Date().toISOString()
    };
  }

  list(){
    return {
      component:"AfriNuc Workspace Orchestrator",
      active:this.active.length,
      contexts:this.active
    };
  }
}
