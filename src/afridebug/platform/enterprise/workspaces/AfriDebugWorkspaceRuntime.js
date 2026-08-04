const workspaces=[];

const AfriDebugWorkspaceRuntime={

  create(input={}){

    const workspace={

      id:`WORKSPACE-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,

      organizationId:input.organizationId||null,

      name:input.name||"Default Workspace",

      createdAt:Date.now()

    };

    workspaces.push(workspace);

    return workspace;

  },

  list(){

    return workspaces;

  },

  stats(){

    return{

      workspaces:workspaces.length

    };

  }

};

export default AfriDebugWorkspaceRuntime;
