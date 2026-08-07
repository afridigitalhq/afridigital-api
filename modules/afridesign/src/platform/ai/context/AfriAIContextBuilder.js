import PlatformWorkspaceController from "../../shell/PlatformWorkspaceController";
import WorkspaceStateManager from "../../workspace/state/WorkspaceStateManager";

const AfriAIContextBuilder = {

  build(){

    const workspace =
      PlatformWorkspaceController.current();

    return {
      studio: "visual",
      workspace: workspace?.id || "design",
      mode: WorkspaceStateManager.currentMode
    };

  }

};

export default AfriAIContextBuilder;
