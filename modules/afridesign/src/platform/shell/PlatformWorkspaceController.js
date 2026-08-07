let activeWorkspace = "design";

const listeners = new Set();

const PlatformWorkspaceController = {

  current(){
    return {
      id: activeWorkspace
    };
  },

  open(workspace){

    activeWorkspace = workspace;

    listeners.forEach(listener=>{
      listener({
        id: activeWorkspace
      });
    });

  },

  subscribe(listener){

    listeners.add(listener);

    return ()=>{
      listeners.delete(listener);
    };

  }

};

export default PlatformWorkspaceController;
