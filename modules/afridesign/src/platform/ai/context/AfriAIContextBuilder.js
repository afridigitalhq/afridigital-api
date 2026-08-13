import PlatformWorkspaceController from "../../shell/PlatformWorkspaceController";

const AfriAIContextBuilder = {

  build(){

    const workspace =
      PlatformWorkspaceController.current();

    return {
      studio: "visual",
      workspace: workspace?.id || "design",
      workspace: PlatformWorkspaceController.current().id
    };

  }

};

export default AfriAIContextBuilder;
