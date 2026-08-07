export class AfriWorkspaceExecutionContext {

  create(workspace,job){

    if(!workspace || !job){
      return {
        component:"AfriNuc Workspace Execution Context",
        status:"FAILED",
        reason:"Missing workspace or job"
      };
    }

    return {
      component:"AfriNuc Workspace Execution Context",
      status:"CREATED",
      context:{
        workspaceId:workspace.workspaceId,
        client:workspace.client,
        project:workspace.project,
        jobId:job.jobId,
        isolation:workspace.isolation,
        executionScope:
          `${workspace.workspaceId}:${job.jobId}`
      },
      createdAt:new Date().toISOString()
    };
  }
}
