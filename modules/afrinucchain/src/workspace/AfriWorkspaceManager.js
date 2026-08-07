export class AfriWorkspaceManager {

  constructor(){
    this.workspaces=[];
  }

  create(workspace){

    const record={
      workspaceId:workspace.workspaceId,
      client:workspace.client,
      project:workspace.project,
      jobs:[],
      isolation:"ENABLED",
      createdAt:new Date().toISOString()
    };

    this.workspaces.push(record);

    return {
      component:"AfriNuc Workspace Manager",
      status:"CREATED",
      workspace:record
    };
  }

  attachJob(workspaceId,jobId){

    const workspace =
      this.workspaces.find(
        w=>w.workspaceId===workspaceId
      );

    if(!workspace){
      return {
        component:"AfriNuc Workspace Manager",
        status:"FAILED",
        reason:"Workspace not found"
      };
    }

    workspace.jobs.push(jobId);

    return {
      component:"AfriNuc Workspace Manager",
      status:"ATTACHED",
      workspaceId,
      jobId
    };
  }

  list(){

    return {
      component:"AfriNuc Workspace Manager",
      total:this.workspaces.length,
      workspaces:this.workspaces
    };
  }
}
