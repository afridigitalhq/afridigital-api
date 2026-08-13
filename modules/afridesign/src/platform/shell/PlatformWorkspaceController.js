import AfriStudioRegistry from "../studios/AfriStudioRegistry";

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

  openStudio(studioId){

    const studio = AfriStudioRegistry.find(
      item => item.id === studioId
    );

    if(studio?.workspace){
      this.open(studio.workspace);
    }

  },

  subscribe(listener){

    listeners.add(listener);

    return ()=>{
      listeners.delete(listener);
    };

  }

};

export default PlatformWorkspaceController;
