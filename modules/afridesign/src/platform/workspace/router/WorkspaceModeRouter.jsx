/**
 * AfriDesign Workspace Mode Router
 *
 * Purpose:
 * Renders active workspace view.
 *
 * Rule:
 * Composition only.
 */

import WorkspaceStateManager from "../state/WorkspaceStateManager";

import DesignWorkspace from "../views/DesignWorkspace";
import CodeWorkspace from "../views/CodeWorkspace";
import FullPreviewWorkspace from "../views/FullPreviewWorkspace";
import AfriAIWorkspace from "../views/AfriAIWorkspace";


export default function WorkspaceModeRouter(){

  const mode =
    WorkspaceStateManager.currentMode;


  if(mode === "code"){
    return <CodeWorkspace />;
  }


  if(mode === "preview"){
    return <FullPreviewWorkspace />;
  }


  if(mode === "ai"){
    return <AfriAIWorkspace />;
  }


  return <DesignWorkspace />;

}
