/**
 * AfriDesign Workspace Router
 *
 * Rendering layer only.
 */

import DesignWorkspace from "../workspace/views/DesignWorkspace";
import CodeWorkspace from "../workspace/views/CodeWorkspace";
import FullPreviewWorkspace from "../workspace/views/FullPreviewWorkspace";
import AfriAIWorkspace from "../workspace/views/AfriAIWorkspace";

export default function PlatformWorkspaceRouter({workspace}){

  const active =
    workspace?.id || "design";


  if(active === "code"){
    return <CodeWorkspace />;
  }


  if(active === "preview"){
    return <FullPreviewWorkspace />;
  }


  if(active === "ai"){
    return <AfriAIWorkspace />;
  }


  return <DesignWorkspace />;

}
