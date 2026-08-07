export class AfriClientWorkspace {

  create(client,project){

    return {
      component:"AfriNuc Client Workspace",
      status:"CREATED",
      workspaceId:`workspace-${Date.now()}`,
      client,
      project,
      isolation:"ENABLED",
      auditTrail:"ENABLED",
      createdAt:new Date().toISOString()
    };

  }

}
